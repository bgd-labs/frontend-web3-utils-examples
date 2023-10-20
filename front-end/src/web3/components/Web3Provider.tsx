import { useConnect } from "wagmi";
import { WagmiProvider } from "../../packages/src/web3/providers/WagmiProvider";
import { useStore } from "../../store";
import { DESIRED_CHAIN_ID } from "../../utils/constants";
import { chainInfoHelpers, CHAINS } from "../store/web3Slice";

export default function WagmiConfigProviderWrapper({ children }: { children: React.ReactNode }) {
  return (
    <WagmiProvider
      connectorsInitProps={{
        appName: "AAVEGovernanceV3",
        chains: CHAINS,
        defaultChainId: DESIRED_CHAIN_ID,
        wcParams: {
          projectId: process.env.NEXT_PUBLIC_WC_PROJECT_ID || '',
          metadata: {
            name: 'wagmi',
            description: 'my wagmi app',
            url: 'https://wagmi.sh',
            icons: ['https://wagmi.sh/icon.png'],
          },
        },
      }}
      useStore={useStore}
    >
      {children}
    </WagmiProvider>
  );
}
