import { CounterSlice } from "../../counter/store/counterSlice";
import { StoreSlice } from "../../packages/src/types/store";

import {
  BaseTx,
  createTransactionsSlice as createBaseTransactionsSlice,
  ITransactionsSlice,
} from "../../packages/src/web3/store/transactionsSlice";
import { IWalletSlice } from "../../packages/src/web3/store/walletSlice";
import { getDefaultRPCProviderForReadData } from "../../web3/store/web3Slice";

const providers = {
  // ZERO because it's tx.chainID returns 0, although suppose to return 5
  0: getDefaultRPCProviderForReadData(),
  5: getDefaultRPCProviderForReadData(),
};

type IncrementTX = BaseTx & {
  type: "increment";
  payload: {};
};

type DecrementTX = BaseTx & {
  type: "decrement";
  payload: {};
};

type TransactionUnion = IncrementTX | DecrementTX;

export type TransactionsSlice = ITransactionsSlice<TransactionUnion>;

export const createTransactionsSlice: StoreSlice<
  TransactionsSlice,
  IWalletSlice & CounterSlice
> = (set, get) => ({
  ...createBaseTransactionsSlice<TransactionUnion>({
    txStatusChangedCallback: (data) => {
      switch (data.type) {
        case "increment":
          get().getCounterValue()
        case "decrement":
          get().getCounterValue()
      }
    },
    defaultProviders: providers,
  })(set, get),
});
