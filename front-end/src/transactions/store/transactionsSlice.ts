import {
  BaseTx,
  createTransactionsSlice as createBaseTransactionsSlice,
  ITransactionsSlice,
  IWalletSlice,
  StoreSlice,
} from '@bgd-labs/frontend-web3-utils';
import { sepolia } from 'viem/chains';

import { CounterSlice } from '../../counter/store/counterSlice';
import { chainInfoHelpers } from '../../web3/store/web3Slice';

const clients = {
  [sepolia.id]: chainInfoHelpers.clientInstances[sepolia.id].instance,
};

type IncrementTX = BaseTx & {
  type: 'increment';
  payload: NonNullable<unknown>;
};

type DecrementTX = BaseTx & {
  type: 'decrement';
  payload: NonNullable<unknown>;
};

export type TransactionUnion = IncrementTX | DecrementTX;

export type TransactionsSlice = ITransactionsSlice<TransactionUnion>;

export const createTransactionsSlice: StoreSlice<
  TransactionsSlice,
  IWalletSlice & CounterSlice
> = (set, get) => ({
  ...createBaseTransactionsSlice<TransactionUnion>({
    txStatusChangedCallback: async (data) => {
      switch (data.type) {
        case 'increment':
          await get().getCounterValue();
          break;
        case 'decrement':
          await get().getCounterValue();
          break;
      }
    },
    defaultClients: clients,
  })(set, get),
});
