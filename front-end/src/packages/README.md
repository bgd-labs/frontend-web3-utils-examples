# Frontend Web3 Shared repo

**IMPORTANT:** REPO IS IN ALFA STATE

The purpose of this repo is to have shared solutions for typical web3 related problems.

Transactions, signing, provider etc

### Limitations

This is not a 1 size fit all library and more like a set of recipes to be used across multiple BGD projects. 
All solutions heavily rely on BGD tech stack, such as [ethers.js](https://docs.ethers.io/v5/), [zustand](https://github.com/pmndrs/zustand), [web3-react](https://github.com/NoahZinsmeister/web3-react).
Outside this stack using BGD solutions will be a problem and repo is provided as is. Feel free to use it as example

Although it is possible to use `TransactionsSlice` separately from `Web3Slice`, but it is unrealistic scenario.

### Requirements

Each solution should provide a complete flow with clear boundaries and entry point for custom logic

---

## TransactionsSlice

Is used as a “black box” to work with transactions life cycle in a DAPP. 
It will add, wait, save them to `localstorage` and do all the necessary logic to check for a network status and updates

*Transaction observer flow*

First we need to define callbackObserver - the component which will be called after tx got broadcast into a blockchain, like so:

```tsx
...createTransactionsSlice<TransactionsUnion>({
    txStatusChangedCallback: (tx) => {
      switch (tx.type) {
        case "somethingNotVeryImportantHappened":
          console.log(tx.payload.buzz);
          return;
        case "somethingImportantHappened":
          console.log(tx.payload.fuzz);
          return;
      }
    },
  })(set, get),
```

`TransactionUnion`  will be different for each application and is used to associate payload type by transaction type

and `providers: Record<number, ethers.providers.JsonRpcProvider>;`

Providers will be used to watch tx on multiple chains if needed.

To make it all work, each tx should go through `.executeTx`  callback. It’s fire and forget flow at the end `callbackObserver` 
will fire tx with type ‘wear’, custom payload and all the data from transaction

```tsx
const tx = await get().executeTx({
      body: () => {
        return get().boredNFTService.wear(tokenID, {
          location: collectionAddress,
          id: svgId,
        });
      },
      params: {
        type: 'wear',
        payload: { tokenID, collectionAddress },
      },
    });
```

## Web3Slice

Web3Slice is a set of ready solutions to work with [web3-react](https://github.com/NoahZinsmeister/web3-react)

It will do appropriate logic to handle different connectors type and save the required states to zustand store

Since web3-react properties are only available through `React.Context`. Custom <Web3Provider /> is required to make `Web3Slice` work.


Example of how to use `<Web3Provider />` in your own app

`yourapp/web3Provider.tsx` →

```tsx
import { Web3Provider as Web3BaseProvider } from "../../packages/web3/providers/Web3Provider";
import { useStore } from "../../store";
import { CHAINS } from "../../utils/chains";

export default function Web3Provider() {
  return (
    <Web3BaseProvider
      connectorsInitProps={{
        appName: "AAVEGovernanceV3",
        chains: CHAINS,
        desiredChainId: 1,
      }}
      useStore={useStore}
    />
  );
}

```

`yourapp/App.tsx`  →

```tsx
function MyApp({ Component, pageProps }: AppProps) {
  return (
    <Fragment>
      <Web3Provider />
      <Component {...pageProps} />
    </Fragment>
  );
}

export default MyApp;
```

Once the setup is done you can finally initialize web3Slice

```tsx
const createWeb3Slice: StoreSlice<IWeb3Slice> = (set, get) => ({
  ...createWeb3BaseSlice({
    walletConnected: () => {
      get().connectSigner();
    },
    getAddChainParameters,
  })(set, get),
})
```

`walletConnected` is a callback which will be executed once wallet is connected, meaning get().activeWallet is set.

All the logic is going **through** store and **NOT** through web3-react hooks

After all the init steps are done, you can finally use

`const connectWallet = useStore((state) => state.connectWallet);`

---

[ ] Add explanation and example on "services"