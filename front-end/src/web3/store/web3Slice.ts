import { StoreSlice } from "../../packages/src/types/store";
import { getAddChainParameters } from "../../utils/chains";

import {
  createWeb3Slice as createWeb3BaseSlice,
  Web3Slice as BaseWeb3Slice,
} from "../../packages/src/web3/store/walletSlice";

import { ethers, providers } from "ethers";
import { CounterDataService } from "../services/counterDataService";

export type Web3Slice = BaseWeb3Slice & {
  // here application custom properties
  rpcProvider: ethers.providers.JsonRpcBatchProvider;
  counterDataService: CounterDataService;
};

// having separate rpc provider for reading data only
export const getDefaultRPCProviderForReadData = () => {
  return new providers.JsonRpcBatchProvider("https://eth-goerli.g.alchemy.com/v2/d0dxbHXgIF7k33SapC7h6KCWkwXP4iNS");
};

export const createWeb3Slice: StoreSlice<Web3Slice> = (set, get) => ({
  ...createWeb3BaseSlice({
    walletConnected: () => {
      const activeWallet = get().activeWallet;
      if (activeWallet) {
        get().counterDataService.connectSigner(activeWallet.signer);
      }
    },
    getAddChainParameters,
    desiredChainID: 5
  })(set, get),
  rpcProvider: getDefaultRPCProviderForReadData(),
  counterDataService: new CounterDataService(
    getDefaultRPCProviderForReadData()
  ),
});
