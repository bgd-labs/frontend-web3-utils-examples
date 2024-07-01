# Examples of frontend web3 utilities from [BGD labs](https://github.com/bgd-labs/).
The purpose of this repo is to demonstrate how to structure front-end project to play nicely with [`@bgd-labs/frontend-web3-utils`](https://github.com/bgd-labs/frontend-web3-utils) package.

## How to use web3-utils package from BGD Labs
In this tutorial, we’ll go through building a very simple counter app, where anyone can change the number by interacting with the interface. 

Typical web3 web app is like a normal web2 app, but with 2 additional aspects:
- Reading data from RPC and smart contracts instead of API
- Signing data with connected wallet for writes

The issue is, these aspects are quite complicated, it’s still can be very cumbersome to setup wallet connection, signing, transaction history, etc... Because there is no 1 size fit all for all the apps and that’s why we in BGD decided to build `@bgd-labs/frontend-web3-utils` is as set of ready to go flows which can be used as a foundation for web3 apps. 

Web3-utils from [BGD labs](https://github.com/bgd-labs/) is very opinionated and more like an architecture model, rather than simple package. It supposes to handle some complicated parts of the whole flow, but not the whole flow.

## What are we going to build?
1. Pick basic counter contract _abi.
2. Start local front-end.
3. Integrate contract _abi into freshly app.
4. Integrate `@bgd-labs/frontend-web3-utils`.

-----------------

## Smart contract
Source code looks like this:

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
--------

## Front-end
When the contract is deployed it’s time to spin up the front-end, but first let’s see how the result would look like

![Contract deployed output](https://raw.githubusercontent.com/bgd-labs/blog/main/images/app_demo.webp)

Although the app logic is basic, it still should go through mandatory flow:
1. Connect wallet
2. Switch network (Sepolia testnet in example)
3. Sign the data with connected wallet
4. Wait for transaction to confirm 
5. Update data after transaction confirmation

But as an application developer, it’s crucial to be able to spin up the interface as fast as possible and dealing with the same flow over and over could be tedious, that’s where [`@bgd-labs/frontend-web3-utils`](https://github.com/bgd-labs/frontend-web3-utils) packages is useful. 

Web3-utils from [BGD labs](https://github.com/bgd-labs/) is design in a way to easily plug in any app which is using [zustand](https://github.com/pmndrs/zustand) for state management. 

You can find [here](https://github.com/bgd-labs/frontend-web3-utils/tree/main?tab=readme-ov-file#how-to-set-up) everything about how to integrate [`@bgd-labs/frontend-web3-utils`](https://github.com/bgd-labs/frontend-web3-utils) package step by step.

-----------------

## App logic CounterSlice

Now the app has all the setup, we can finally write the app logic itself.

```tsx
import { StoreSlice } from '@bgd-labs/frontend-web3-utils';

import { TransactionsSlice } from '../../transactions/store/transactionsSlice';
import { IWeb3Slice } from '../../web3/store/web3Slice';

export interface CounterSlice {
	counterLoading: boolean;
	counterValue?: bigint;
	increment: () => Promise<void>;
	decrement: () => Promise<void>;
	getCounterValue: () => Promise<void>;
}

export const createCounterSlice: StoreSlice<CounterSlice, IWeb3Slice & TransactionsSlice> = (set, get) => ({
	increment: async () => {
		await get().executeTx({
			body: () => get().counterDataService.increment(),
			params: {
				type: 'increment',
				payload: {},
				desiredChainID: chainId,
			},
		});
	},
	decrement: async () => {
		await get().executeTx({
			body: () => get().counterDataService.decrement(),
			params: {
				type: 'decrement',
				payload: {},
				desiredChainID: chainId,
			},
		});
	},
	counterLoading: true,
	getCounterValue: async () => {
		set({ counterLoading: true });
		const counterValue = await get().counterDataService.fetchCurrentNumber();
		set({ counterValue, counterLoading: false });
	},
});
```

As you can see all data fetching is going through `get().counterDataService` this way even if the shape of the contract changes a bit, it will only affect counterDataService.
Another important part is:

`get().executeTx({body, params})` 

- this shape is used each time write to smart contract happens. `BGD Web3 utils` will take care of switching network before constructing a transaction, saving transaction to pool and calling `txStatusChangedCallback` with any payload you’ve passed. 

---------------------------------------

That’s it! The business layer of our app is done, as you can see, it’s effortless to work with transactions and signers once we finished setup. Feature slices have nothing to do with transaction itself, but at the same time the app has all the flexibility to work with any type of contract.

The full code example is available [here](https://github.com/bgd-labs/frontend-web3-utils-examples/tree/main/src).
