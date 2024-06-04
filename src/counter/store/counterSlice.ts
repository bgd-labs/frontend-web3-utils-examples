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
  incrementGelato: async () => {
    await get().executeTx({
      body: () => get().counterDataService.incrementGelato(),
      params: {
        type: 'increment',
        payload: {},
        desiredChainID: DESIRED_CHAIN_ID,
      },
    });
  },
  decrementGelato: async () => {
    await get().executeTx({
      body: () => get().counterDataService.decrementGelato(),
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
