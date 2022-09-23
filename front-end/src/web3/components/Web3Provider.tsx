import { Web3Provider as Web3BaseProvider } from "../../packages/src/web3/providers/Web3Provider";
import { useStore } from "../../store";
import { DESIRED_CHAIN_ID } from "../../utils/constants";
import { chainInfoHelpers, CHAINS } from "../store/web3Slice";

export default function Web3Provider() {
  return (
    <Web3BaseProvider
      connectorsInitProps={{
        appName: "AAVEGovernanceV3",
        chains: CHAINS,
        desiredChainId: DESIRED_CHAIN_ID,
        urls: chainInfoHelpers.urls
      }}
      useStore={useStore}
    />
  );
}
