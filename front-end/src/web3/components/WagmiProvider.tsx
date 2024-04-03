import {
  createWagmiConfig,
  WagmiZustandSync,
} from '@bgd-labs/frontend-web3-utils';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React, { useMemo } from 'react';
import { WagmiProvider } from 'wagmi';

import { useStore } from '../../store/ZustandStoreProvider';
import { CHAINS } from '../../utils/chains';
import { DESIRED_CHAIN_ID } from '../../utils/constants';

const queryClient = new QueryClient();

export default function WagmiConfigProviderWrapper() {
  // IMPORTANT !!! the active wallet must be initialized here, otherwise it gets frozen and eventually all operations with the wallet become unavailable
  useStore((store) => store.activeWallet);

  const getImpersonatedAddress = useStore(
    (store) => store.getImpersonatedAddress,
  );
  const setWagmiConfig = useStore((store) => store.setWagmiConfig);
  const changeActiveWalletAccount = useStore(
    (store) => store.changeActiveWalletAccount,
  );
  const setDefaultChainId = useStore((store) => store.setDefaultChainId);

  const config = useMemo(() => {
    return createWagmiConfig({
      chains: CHAINS,
      connectorsInitProps: {
        appName: 'AAVEGovernanceV3',
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
      },
      getImpersonatedAccount: getImpersonatedAddress,
    });
  }, []);

  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <WagmiZustandSync
          wagmiConfig={config}
          defaultChainId={DESIRED_CHAIN_ID}
          store={{
            setWagmiConfig,
            changeActiveWalletAccount,
            setDefaultChainId,
          }}
        />
      </QueryClientProvider>
    </WagmiProvider>
  );
}
