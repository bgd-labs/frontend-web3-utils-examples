import {
  createWalletSlice,
  initChainInformationConfig,
  IWalletSlice,
  StoreSlice,
} from '@bgd-labs/frontend-web3-utils';
import { produce } from 'immer';
import { goerli } from 'viem/chains';

import { TransactionsSlice } from '../../transactions/store/transactionsSlice';
import { CHAINS } from '../../utils/chains';
import { CounterDataService } from '../services/counterDataService';

export const chainInfoHelpers = initChainInformationConfig(CHAINS);

export type IWeb3Slice = IWalletSlice & {
  wagmiProviderInitialize: boolean;
  setWagmiProviderInitialize: (value: boolean) => void;

  counterDataService: CounterDataService;
  connectSigner: () => void;
};

// having separate rpc provider for reading data only
export const getDefaultRPCProviderForReadData = () => {
  return chainInfoHelpers.clientInstances[goerli.id].instance;
};

export const createWeb3Slice: StoreSlice<IWeb3Slice, TransactionsSlice> = (
  set,
  get,
) => ({
  ...createWalletSlice({
    walletConnected: () => {
      get().connectSigner();
    },
  })(set, get),

  wagmiProviderInitialize: false,
  setWagmiProviderInitialize: (value) => {
    set((state) =>
      // !!! important, should be produce from immer, and we need to set value to zustand store when app initialize to work properly with wagmi
      produce(state, (draft) => {
        draft.wagmiProviderInitialize = true;
      }),
    );
  },

  counterDataService: new CounterDataService(
    getDefaultRPCProviderForReadData(),
  ),
  connectSigner() {
    const wagmiConfig = get().wagmiConfig;
    if (wagmiConfig) {
      get().counterDataService.connectSigner(wagmiConfig);
    }
  },
});
