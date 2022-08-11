import { StoreSlice } from "../../packages/src/types/store";
import { getAddChainParameters } from "../../utils/chains";

import {
  createWeb3Slice as createWeb3BaseSlice,
  Web3Slice as BaseWeb3Slice,
} from "../../packages/src/web3/store/walletSlice";

import { ethers, providers } from "ethers";
import { IncrementDartaService } from "../services/incrementDataService";

export type Web3Slice = BaseWeb3Slice & {
  // here application custom properties
  rpcProvider: ethers.providers.JsonRpcBatchProvider;
  incrementDataService: IncrementDartaService;
  fetchCurrentNumber: () => Promise<void>;
};

// having separate rpc provider for reading data only
export const getDefaultRPCProviderForReadData = () => {
  return new providers.JsonRpcBatchProvider("http://127.0.0.1:8545");
};

export const createWeb3Slice: StoreSlice<Web3Slice> = (set, get) => ({
  rpcProvider: getDefaultRPCProviderForReadData(),
  incrementDataService: new IncrementDartaService(
    getDefaultRPCProviderForReadData()
  ),
  fetchCurrentNumber: async () => {
    const currentNumber = await get().incrementDataService.fetchCurrentNumber()
    console.log(currentNumber.toNumber(), 'currentNumber')
  },
  ...createWeb3BaseSlice({
    walletConnected: () => {},
    getAddChainParameters,
  })(set, get),
});
