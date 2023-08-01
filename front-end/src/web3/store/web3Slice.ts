import { TransactionsSlice } from './../../transactions/store/transactionsSlice';
import { StoreSlice } from "../../packages/src/types/store";

import {
  createWalletSlice,
  IWalletSlice,
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

export type IWeb3Slice = IWalletSlice & {
  counterDataService: CounterDataService;
  connectSigner: () => void;
};

// having separate rpc provider for reading data only
export const getDefaultRPCProviderForReadData = () => {
  return chainInfoHelpers.providerInstances[5].instance;
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
    if (activeWallet?.signer) {
      get().counterDataService.connectSigner(activeWallet.signer);
    }
  },
});
