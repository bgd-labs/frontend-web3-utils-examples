import { StoreSlice } from "../../packages/src/types/store";

import {
  BaseTx,
  createTransactionsSlice as createBaseTransactionsSlice,
  ITransactionsSlice,
} from "../../packages/src/web3/store/transactionsSlice";
import { Web3Slice } from "../../packages/src/web3/store/walletSlice";
import { getDefaultRPCProviderForReadData } from "../../web3/store/web3Slice";

const providers = {
  0: getDefaultRPCProviderForReadData(),
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
  Web3Slice
> = (set, get) => ({
  ...createBaseTransactionsSlice<TransactionUnion>({
    txStatusChangedCallback: (data) => {
      switch (data.type) {
        case "increment":
          console.log("refetch value");
        case "decrement":
          console.log("refetch value")
      }
    },
    providers,
  })(set, get),
});
