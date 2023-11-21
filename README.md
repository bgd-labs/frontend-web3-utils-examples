# BGD front-end example
The purpose of this repo is to demonstrate how to structure front-end project to play nicely with [`fe-shared`](https://github.com/bgd-labs/fe-shared) package
## How to use fe-shared package from BGD Labs
In this tutorial, we’ll go through building a very simple counter app, where anyone can change the number by interacting with the interface. 

Typical web3 web app is like a normal web2 app, but with 2 additional aspects 
- Reading data from RPC and smart contracts instead of API
- Signing data with connected wallet for writes
The issue is: These aspects are quite complicated, even with libraries like [viem.sh](https://viem.sh/) and [wagmi.sh](https://wagmi.sh/) it’s still can be very cumbersome to setup wallet connection, signing, transaction history etc because there is no 1 size fit all for all the apps and that’s why we in BGD decided to build `fe-shared` is as set of ready to go flows which can be used as a foundation for web3 apps. 

Fe-shared is very opinionated and more like an architecture model, rather than library. It supposes to handle some complicated parts of the whole flow, but not the whole flow.

## What are we going to build?
To understand why exactly, there is always an RPC and wallet. Let’s go through writing a simple smart contract and deploy it on local test net, the steps would be:
1. Write a smart contract
2. Deploy to local anvil testnet
3. Generate typescript types 
4. Start local front-end 
5. Integrate typechain types into freshly created app
6. Connect custom code to fe-shared
This way we’ll have an idea of the entire process and can easily tweak smart contract to experiment.

## Smart contract
The whole contract is a bit modified example of [SimpleStorage example](https://docs.soliditylang.org/en/develop/introduction-to-smart-contracts.html#storage-example)
Source code looks like this 
```Solidity
// SPDX-License-Identifier: GPL-3.0
pragma solidity 0.8.10;

contract SimpleStorage {
    uint256 storedData;

    function increment() public {
        storedData++;
    }

    function decrement() public {
        if (storedData > 0) {
            storedData--;
        }
    }

    function getCurrentNumber() public view returns (uint256) {
        return storedData;
    }
}

```
If you want to see how front-end is built, skip to front-end part right away, otherwise here is how to run the project with local anvil environment from [foundry](https://github.com/foundry-rs/foundry)
### Running locally and deploying the contract
1. Install [foundy](https://getfoundry.sh)
2. In terminal run command `anvil`, the output should look something like this  
	![Anvil output](https://raw.githubusercontent.com/bgd-labs/blog/main/images/anvil_output.png)
3. Go to `fe-shared-example/contracts` folder and create `.env` file (there is .env.example file for reference)
4. Add one of the private keys from anvil output like so (address can differ) to the end of .env file
```bash
PK=0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80
```
5. Add anvil url to the end of .env file (don’t forget http:// before anvil url)
```bash
ANVIL_RPC=http://127.0.0.1:8545
```
6. Call `source .env` to load environment variables
7. Inside contracts folder call `forge install`
8. Deploy `Counter` contract to anvil go to contracts folder and execute
```bash
forge script script/Counter.s.sol:CounterScript --fork-url $ANVIL_RPC --private-key $PK --broadcast
```

Once the contract is deployed, you should have contract address like so
![Contract deployed output](https://raw.githubusercontent.com/bgd-labs/blog/main/images/anvil_deploy.png)
Let’s test if it’s working fine, add one more variable to .env file and call `source .env`
```bash
 CONTRACT_ADDRESS=0x5fbdb2315678afecb367f032d93f642f64180aa3
```
Let’s verify if contract is working as expected
1. Increment
```bash
cast send $CONTRACT_ADDRESS "increment()" --private-key $PK --rpc-url $ANVIL_RPC
```
2. Get counter value _should output 1_
```bash
cast call $CONTRACT_ADDRESS "getCurrentNumber()(uint256)" --rpc-url $ANVIL_RPC
```

Hooray! The contract is deployed and running on local network. 
---- 
## Front-end
Now when the contract is up and running it’s time to spin up the front-end, but first let’s see how the result would look like

![Contract deployed output](https://raw.githubusercontent.com/bgd-labs/blog/main/images/app_demo.webp)
Although the app logic is basic, it still should go through mandatory flow
1. Connect wallet
2. Switch network (Goerli testnet in example)
3. Sign the data with connected wallet
4. Wait for transaction to confirm 
5. Update data after transaction confirmation
But as an application developer, it’s crucial to be able to spin up the interface as fast as possible and dealing with the same flow over and over could be tedious, that’s where [fe-shared](https://github.com/bgd-labs/fe-shared) packages is useful. 

Fe-shared is design in a way to easily plug in any app which is using [Zustand](https://github.com/pmndrs/zustand) for state management. Although it is possible to use it without Zustand, it’s still the easiest way.

## Services
First let’s start with `services` folder, it’s where abi files are located, we’ll create services for each abi, to only pass the required data, do some sorting and easily mock contract responses in tests

```ts
import { PublicClient, WalletClient } from '@wagmi/core';
import { encodeFunctionData, getContract } from 'viem';
import { COUNTER_ADDRESS, DESIRED_CHAIN_ID } from '../../utils/constants';
import { _abi as CounterAbi } from '../services/abi/CounterAbi';

export class CounterDataService {
  private counterFactory;
  private publicClient: PublicClient;
  private walletClient: WalletClient | undefined = undefined;
  constructor(publicClient: PublicClient) {
    this.publicClient = publicClient;
    this.counterFactory = getContract({
      address: COUNTER_ADDRESS,
      abi: CounterAbi,
      publicClient,
      walletClient: this.walletClient,
    });
  }

  public connectSigner(walletClient: WalletClient) {
    this.walletClient = walletClient;
    this.counterFactory = getContract({
      address: this.counterFactory.address,
      abi: this.counterFactory.abi,
      publicClient: this.publicClient,
      walletClient: this.walletClient,
    });
  }

  async fetchCurrentNumber() {
    return await this.counterFactory.read.getCurrentNumber();
  }

  async increment() {
    if (this.walletClient) {
      // @ts-ignore
      return this.counterFactory.write.increment();
    } else {
      throw new Error('CONNECT YOUR SIGNER');
    }
  }

  async decrement() {
    if (this.walletClient) {
      // @ts-ignore
      return this.counterFactory.write.decrement();
    } else {
      throw new Error('CONNECT YOUR SIGNER');
    }
  }
}

```

Each service should have some sort of `connectSigner` method. It’s done to fetch and sign data through different RPCs. Other way user will need to switch to proper network before seeing any data, and it makes everything even harder for apps communicating with multiple blockchains.

## Web3 slice
Now when we have a service for fetching smart contract data ready, let’s see how we can use it properly. Conveniently, fe-shared has everything covered. To make it work, we need first to init `WagmiProvider`  this is due to some methods of `wagmi.sh` only being available through Context API
`src/web3/components/WagmiProvider.tsx`
```ts
import { WagmiProvider } from '@bgd-labs/frontend-web3-utils';
import { useStore } from '../../store';
import { DESIRED_CHAIN_ID } from '../../utils/constants';
import { CHAINS } from '../store/web3Slice';

export default function WagmiConfigProviderWrapper() {
  return (
    <WagmiProvider
      connectorsInitProps={{
        appName: <your_app_name>,
        chains: CHAINS,
        defaultChainId: DESIRED_CHAIN_ID,
        // not required, but needed to use WalletConnect
        wcParams: {
          projectId: <your_project_id>,
          metadata: {
            name: 'wagmi',
            description: 'my wagmi app',
            url: 'https://wagmi.sh',
            icons: ['https://wagmi.sh/icon.png'],
          },
        },
      }}
      useStore={useStore}
    />
  );
}

```
`pages/_app.tsx`
```ts
import '../styles/globals.css';
import type { AppProps } from 'next/app';
import WagmiConfigProviderWrapper from '../src/web3/components/WagmiProvider';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <WagmiConfigProviderWrapper />
      <Component {...pageProps} />
    </>
  );
}

export default MyApp;

```

After that, we can finally initialize our custom Web3Slice
`src/web3/store/Web3Slice.tsx`
```ts
import {
  createWalletSlice,
  initChainInformationConfig,
  IWalletSlice,
  StoreSlice,
} from '@bgd-labs/frontend-web3-utils';
import { goerli } from 'viem/chains';
import { Chain } from 'wagmi';

import { TransactionsSlice } from '../../transactions/store/transactionsSlice';
import { CounterDataService } from '../services/counterDataService';

export const CHAINS: {
  [chainId: number]: Chain;
} = {
  [goerli.id]: goerli,
};

export const chainInfoHelpers = initChainInformationConfig(CHAINS);

export type IWeb3Slice = IWalletSlice & {
  counterDataService: CounterDataService;
  connectSigner: () => void;
};

// having separate rpc provider for reading data only
export const getDefaultRPCProviderForReadData = () => {
  return chainInfoHelpers.clientInstances[goerli.id].instance;
};

export const createWeb3Slice: StoreSlice<IWeb3Slice, TransactionsSlice> = (
  set,
  get,
) => ({
  ...createWalletSlice({
    walletConnected: () => {
      get().connectSigner();
    },
  })(set, get),
  counterDataService: new CounterDataService(
    getDefaultRPCProviderForReadData(),
  ),
  connectSigner() {
    const activeWallet = get().activeWallet;
    if (activeWallet && activeWallet.walletClient) {
      get().counterDataService.connectSigner(activeWallet.walletClient);
    }
  },
});

```
The purpose of Web3Slice is to have all the data services initialized so other part of the application could just call this services directly, without worrying where to handle it. Just do `get().counterDataService` 
`walletConnected` is a callback function which will be called once the wallet is connected and `activeWallet` is already set. 
Initializing Web3Slice and TransactionsSlice which will do the next is typically should be done once per app
## Transactions slice
Web3Slice is a good way to structure read data services, but how to communicate with transactions? 
For that, we need to initialize our custom `TransactionsSlice` 
`src/transactions/store/transactionsSlice.ts`
```ts
import {
  BaseTx,
  createTransactionsSlice as createBaseTransactionsSlice,
  ITransactionsSlice,
  IWalletSlice,
  StoreSlice,
} from '@bgd-labs/frontend-web3-utils';
import { goerli } from 'viem/chains';

import { CounterSlice } from '../../counter/store/counterSlice';
import { getDefaultRPCProviderForReadData } from '../../web3/store/web3Slice';

const clients = {
  [goerli.id]: getDefaultRPCProviderForReadData(),
};

type IncrementTX = BaseTx & {
  type: 'increment';
  payload: {};
};

type DecrementTX = BaseTx & {
  type: 'decrement';
  payload: {};
};

export type TransactionUnion = IncrementTX | DecrementTX;

export type TransactionsSlice = ITransactionsSlice<TransactionUnion>;

export const createTransactionsSlice: StoreSlice<
  TransactionsSlice,
  IWalletSlice & CounterSlice
> = (set, get) => ({
  ...createBaseTransactionsSlice<TransactionUnion>({
    txStatusChangedCallback: (data) => {
      switch (data.type) {
        case 'increment':
          get().getCounterValue();
          break;
        case 'decrement':
          get().getCounterValue();
          break;
      }
    },
    defaultClients: clients,
  })(set, get),
});


```
`TransactionSlice` will take care of adding transactions, switching networks, saving transactions to local storage and calling `txStatusChangedCallback` properly typed with all the `payload` data. In this example, both transactions call `get().counterValue()`

The setup is almost done, we only need to add slices to root slice 
`src/store/index.ts`
```ts
import { create, StoreApi } from 'zustand';
import { devtools } from 'zustand/middleware';

import {
  CounterSlice,
  createCounterSlice,
} from '../counter/store/counterSlice';
import {
  createTransactionsSlice,
  TransactionsSlice,
} from '../transactions/store/transactionsSlice';
import { createWeb3Slice, IWeb3Slice } from '../web3/store/web3Slice';

type RootState = IWeb3Slice & TransactionsSlice & CounterSlice;

const createRootSlice = (
  set: StoreApi<RootState>['setState'],
  get: StoreApi<RootState>['getState'],
) => ({
  ...createWeb3Slice(set, get),
  ...createTransactionsSlice(set, get),
  ...createCounterSlice(set, get),
});

export const useStore = create(devtools(createRootSlice, { serialize: true }));

```
It will throw an error due to `createCounterSlice` is not written yet
## App logic CounterSlice
Now the app has all the setup, we can finally write the app logic itself.
```ts
import { StoreSlice } from '@bgd-labs/frontend-web3-utils';
import { TransactionsSlice } from '../../transactions/store/transactionsSlice';
import { DESIRED_CHAIN_ID } from '../../utils/constants';
import { IWeb3Slice } from '../../web3/store/web3Slice';

export interface CounterSlice {
  counterLoading: boolean;
  counterValue?: bigint;
  increment: () => Promise<void>;
  decrement: () => Promise<void>;
  getCounterValue: () => Promise<void>;
  incrementGelato: () => Promise<void>;
  decrementGelato: () => Promise<void>;
}

export const createCounterSlice: StoreSlice<
  CounterSlice,
  IWeb3Slice & TransactionsSlice
> = (set, get) => ({
  increment: async () => {
    await get().executeTx({
      body: () => get().counterDataService.increment(),
      params: {
        type: 'increment',
        payload: {},
        desiredChainID: DESIRED_CHAIN_ID,
      },
    });
  },
  decrement: async () => {
    await get().executeTx({
      body: () => get().counterDataService.decrement(),
      params: {
        type: 'decrement',
        payload: {},
        desiredChainID: DESIRED_CHAIN_ID,
      },
    });
  },
  counterLoading: true,
  getCounterValue: async () => {
    set({
      counterLoading: true,
    });
    const counterValue = await get().counterDataService.fetchCurrentNumber();

    set({
      counterValue,
      counterLoading: false,
    });
  },
});


```
As you can see all data fetching is going through `get().counterDataService` this way even if the shape of the contract changes a bit, it will only affect counterDataService
Another important part is 
`get().executeTx({body, params})` this shape is used each time write to smart contract happens. Fe-shared will take care of switching network before constructing a transaction, saving transaction to pool and calling `txStatusChangedCallback` with any payload you’ve passed. 

That’s it! The business layer of our app is done, as you can see, it’s effortless to work with transactions and signers once we finished setup. Feature slices have nothing to do with transaction itself, but at the same time the app has all the flexibility to work with any type of contract.
The full example is available [here](https://github.com/bgd-labs/fe-shared-examples)