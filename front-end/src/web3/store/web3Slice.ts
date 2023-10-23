import {
  createWalletSlice,
  initChainInformationConfig,
  IWalletSlice,
  StoreSlice,
} from '@bgd-labs/frontend-web3-utils';
import { goerli } from 'viem/chains';
import { Chain } from 'wagmi';

import { TransactionsSlice } from '../../transactions/store/transactionsSlice';
import { CounterDataService } from '../services/counterDataService';

export const CHAINS: {
  [chainId: number]: Chain;
} = {
  [goerli.id]: goerli,
};

export const chainInfoHelpers = initChainInformationConfig(CHAINS);

export type IWeb3Slice = IWalletSlice & {
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
  counterDataService: new CounterDataService(
    getDefaultRPCProviderForReadData(),
  ),
  connectSigner() {
    const activeWallet = get().activeWallet;
    if (activeWallet && activeWallet.walletClient) {
      get().counterDataService.connectSigner(activeWallet.walletClient);
    }
  },
});
