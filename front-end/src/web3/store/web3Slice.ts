import { StoreSlice } from "../../packages/src/types/store";

import {
  createWeb3Slice as createWeb3BaseSlice,
  Web3Slice as BaseWeb3Slice,
} from "../../packages/src/web3/store/walletSlice";

import { ethers, providers } from "ethers";
import { CounterDataService } from "../services/counterDataService";
import { DESIRED_CHAIN_ID, RPC_URL } from "../../utils/constants";
import {
  BasicChainInformation,
  ExtendedChainInformation,
} from "../../packages/src";
import { AddEthereumChainParameter } from "@web3-react/types";
import { ChainInformation, initChainInformationConfig } from "../../packages/src/utils/chainInfoHelpers";

const ETH: AddEthereumChainParameter["nativeCurrency"] = {
  name: "Ether",
  symbol: "ETH",
  decimals: 18,
};


export const CHAINS: {
  [chainId: number]: ChainInformation;
} = {
  5: {
    urls: [
      RPC_URL,
    ],
    nativeCurrency: ETH,
    name: "Goereli testnet",
    blockExplorerUrls: ["https://etherscan.io"],
  },
};

export const chainInfoHelpers = initChainInformationConfig(CHAINS);

export type Web3Slice = BaseWeb3Slice & {
  // here application custom properties
  rpcProvider: ethers.providers.JsonRpcBatchProvider;
  counterDataService: CounterDataService;
};

// having separate rpc provider for reading data only
export const getDefaultRPCProviderForReadData = () => {
  return chainInfoHelpers.providerInstances[5].instance
};

export const createWeb3Slice: StoreSlice<Web3Slice> = (set, get) => ({
  ...createWeb3BaseSlice({
    walletConnected: () => {
      const activeWallet = get().activeWallet;
      if (activeWallet) {
        get().counterDataService.connectSigner(activeWallet.signer);
      }
    },
    getChainParameters: chainInfoHelpers.getChainParameters,
    desiredChainID: DESIRED_CHAIN_ID,
  })(set, get),
  rpcProvider: getDefaultRPCProviderForReadData(),
  counterDataService: new CounterDataService(
    getDefaultRPCProviderForReadData()
  ),
});
