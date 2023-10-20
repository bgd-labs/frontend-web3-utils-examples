import create, { GetState, SetState } from 'zustand';
import { devtools } from 'zustand/middleware';
import { CounterSlice, createCounterSlice } from '../counter/store/counterSlice';

import {
  createTransactionsSlice,
  TransactionsSlice,
} from '../transactions/store/transactionsSlice';
import { createWeb3Slice, IWeb3Slice } from '../web3/store/web3Slice';


type RootState = IWeb3Slice & TransactionsSlice & CounterSlice;

const createRootSlice = (
  set: SetState<RootState>,
  get: GetState<RootState>
) => ({
  ...createWeb3Slice(set, get),
  ...createTransactionsSlice(set, get),
  ...createCounterSlice(set, get),
});

export const useStore = create(devtools(createRootSlice, { serialize: true }));



