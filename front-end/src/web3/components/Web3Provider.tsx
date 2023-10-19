import { useConnect } from "wagmi";
import { WagmiConfigProvider } from "../../packages/src/web3/providers/Web3Provider";
import { useStore } from "../../store";
import { DESIRED_CHAIN_ID } from "../../utils/constants";
import { chainInfoHelpers, CHAINS } from "../store/web3Slice";

export default function WagmiConfigProviderWrapper({ children }: { children: React.ReactNode }) {
  return (
    <WagmiConfigProvider
      connectorsInitProps={{
        appName: "AAVEGovernanceV3",
        chains: CHAINS,
        defaultChainId: DESIRED_CHAIN_ID,
        // urls: chainInfoHelpers.urls,
        wcProjectId: process.env.NEXT_PUBLIC_WC_PROJECT_ID || ''
      }}
      useStore={useStore}
    >
      {children}
    </WagmiConfigProvider>
  );
}
