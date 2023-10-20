import { goerli } from 'viem/chains';
import { TransactionsSlice } from './../../transactions/store/transactionsSlice';
import { StoreSlice } from "../../packages/src/types/store";

import {
  createWalletSlice,
  IWalletSlice,
} from "../../packages/src/web3/store/walletSlice";

import { CounterDataService } from "../services/counterDataService";

import { initChainInformationConfig } from "../../packages/src/utils/chainInfoHelpers";
import { Chain } from 'wagmi';

export const CHAINS: {
  [chainId: number]: Chain;
} = {
  [goerli.id]: goerli
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

export const createWeb3Slice: StoreSlice<IWeb3Slice, TransactionsSlice> = (set, get) => ({
  ...createWalletSlice({
    walletConnected: () => {
      get().connectSigner();
    },
    getChainParameters: chainInfoHelpers.getChainParameters,
    // desiredChainID: DESIRED_CHAIN_ID,
  })(set, get),
  counterDataService: new CounterDataService(
    getDefaultRPCProviderForReadData()
  ),
  connectSigner() {
    const activeWallet = get().activeWallet;
    console.log('connectSigner', activeWallet)
    if (activeWallet?.walletClient) {
      get().counterDataService.connectSigner(activeWallet.walletClient);
    }
  },
});
