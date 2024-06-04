'use client';

import { createContext, type ReactNode, useContext, useRef } from 'react';
import { create, type StoreApi, useStore as useZustandStore } from 'zustand';
import { devtools } from 'zustand/middleware';

// combine zustand slices to one root store
import {
  CounterSlice,
  createCounterSlice,
} from '../counter/store/counterSlice';
import {
  createTransactionsSlice,
  TransactionsSlice,
} from '../transactions/store/transactionsSlice';
import { createWeb3Slice, IWeb3Slice } from '../web3/store/web3Slice';

export type RootState = IWeb3Slice & TransactionsSlice & CounterSlice;

const createRootSlice = (
  set: StoreApi<RootState>['setState'],
  get: StoreApi<RootState>['getState'],
) => ({
  ...createWeb3Slice(set, get),
  ...createTransactionsSlice(set, get),
  ...createCounterSlice(set, get),
});

// provider with zustand store https://docs.pmnd.rs/zustand/guides/nextjs
export const ZustandStoreContext = createContext<StoreApi<RootState> | null>(
  null,
);

export interface ZustandStoreProviderProps {
  children: ReactNode;
}

export const ZustandStoreProvider = ({
  children,
}: ZustandStoreProviderProps) => {
  const storeRef = useRef<StoreApi<RootState>>();
  if (!storeRef.current) {
    storeRef.current = create(devtools(createRootSlice, { serialize: true }));
  }

  return (
    <ZustandStoreContext.Provider value={storeRef.current}>
      {children}
    </ZustandStoreContext.Provider>
  );
};

export const useStore = <T,>(selector: (store: RootState) => T): T => {
  const zustandStoreContext = useContext(ZustandStoreContext);

  if (!zustandStoreContext) {
    throw new Error(`useStore must be use within ZustandStoreProvider`);
  }

  return useZustandStore(zustandStoreContext, selector);
};
