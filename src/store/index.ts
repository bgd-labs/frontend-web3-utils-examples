'use client';

import { type StoreApi } from 'zustand';

// combine zustand slices to one root store
import { CounterSlice, createCounterSlice } from './counterSlice';
import {
  createTransactionsSlice,
  TransactionsSlice,
} from './transactionsSlice';
import { createWeb3Slice, IWeb3Slice } from './web3Slice';

export type RootState = IWeb3Slice & TransactionsSlice & CounterSlice;

export const createRootSlice = (
  set: StoreApi<RootState>['setState'],
  get: StoreApi<RootState>['getState'],
) => ({
  ...createWeb3Slice(set, get),
  ...createTransactionsSlice(set, get),
  ...createCounterSlice(set, get),
});
