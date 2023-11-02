import { WagmiProvider } from '@bgd-labs/frontend-web3-utils';

import { useStore } from '../../store';
import { DESIRED_CHAIN_ID } from '../../utils/constants';
import { CHAINS } from '../store/web3Slice';

export default function WagmiConfigProviderWrapper() {
  return (
    <WagmiProvider
      connectorsInitProps={{
        appName: 'AAVEGovernanceV3',
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
    />
  );
}
