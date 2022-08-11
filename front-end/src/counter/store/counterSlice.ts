import { StoreSlice, Web3Slice } from "../../packages/src";
import { TransactionsSlice } from "../../transactions/store/transactionsSlice";

export interface CounterSlice {
  currentNumber?: number;
  increment: () => Promise<void>;
  decrement: () => Promise<void>;
}

export const createCounterSlice: StoreSlice<
  CounterSlice,
  Web3Slice & TransactionsSlice
> = (set, get) => ({
  increment: async () => {
    
  },
  decrement: async () => {},
});
