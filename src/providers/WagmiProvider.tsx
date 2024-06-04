'use client';

import {
  createWagmiConfig,
  WagmiZustandSync,
} from '@bgd-labs/frontend-web3-utils';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React, { useEffect, useMemo } from 'react';

import { CHAINS } from '../utils/chains';
import { DESIRED_CHAIN_ID } from '../utils/constants';
import { useStore } from './ZustandStoreProvider';

const queryClient = new QueryClient();

export default function WagmiConfigProviderWrapper() {
  const getImpersonatedAddress = useStore(
    (store) => store.getImpersonatedAddress,
  );
  const setWagmiConfig = useStore((store) => store.setWagmiConfig);
  const changeActiveWalletAccount = useStore(
    (store) => store.changeActiveWalletAccount,
  );
  const setDefaultChainId = useStore((store) => store.setDefaultChainId);

  const setWagmiProviderInitialize = useStore(
    (store) => store.setWagmiProviderInitialize,
  );
  useEffect(() => {
    setWagmiProviderInitialize(true);
  }, []);

  const config = useMemo(() => {
    return createWagmiConfig({
      chains: CHAINS,
      connectorsInitProps: {
        appName: 'frontend-web3-utils-examples',
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
      ssr: true,
    });
  }, []);

  return (
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
  );
}
