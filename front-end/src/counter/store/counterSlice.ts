import { BigNumber } from "ethers";
import { StoreSlice } from "../../packages/src";
import { TransactionsSlice } from "../../transactions/store/transactionsSlice";
import { Web3Slice } from "../../web3/store/web3Slice";

export interface CounterSlice {
  counterLoading: boolean;
  counterValue?: BigNumber;
  increment: () => Promise<void>;
  decrement: () => Promise<void>;
  getCounterValue: () => Promise<void>;
}

export const createCounterSlice: StoreSlice<
  CounterSlice,
  Web3Slice & TransactionsSlice
> = (set, get) => ({
  increment: async () => {
    await get().executeTx({
      body: () => get().counterDataService.increment(),
      params: {
        type: 'increment',
        payload: {},
      },
    });
  },
  decrement: async () => {
    await get().executeTx({
      body: () => get().counterDataService.decrement(),
      params: {
        type: 'decrement',
        payload: {},
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
