import {
  BaseTx,
  createTransactionsSlice as createBaseTransactionsSlice,
  ITransactionsSlice,
  IWalletSlice,
  StoreSlice,
} from '@bgd-labs/frontend-web3-utils';
import { goerli } from 'viem/chains';

import { CounterSlice } from '../../counter/store/counterSlice';
import { getDefaultRPCProviderForReadData } from '../../web3/store/web3Slice';

const clients = {
  [goerli.id]: getDefaultRPCProviderForReadData(),
};

type IncrementTX = BaseTx & {
  type: 'increment';
  payload: {};
};

type DecrementTX = BaseTx & {
  type: 'decrement';
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
        case 'increment':
          get().getCounterValue();
          break;
        case 'decrement':
          get().getCounterValue();
          break;
      }
    },
    defaultClients: clients,
  })(set, get),
});
