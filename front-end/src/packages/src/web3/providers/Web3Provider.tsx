import { useWeb3React, Web3ReactProvider } from '@web3-react/core';
import { Connector } from '@web3-react/types';
import React, { useEffect } from 'react';
import { StoreApi, UseBoundStore } from 'zustand';

import {
  AllConnectorsInitProps,
  getConnectorName,
  initAllConnectors,
} from '../connectors';
import { Wallet } from '../store/walletSlice';

interface Web3ProviderProps {
  useStore: UseBoundStore<
    StoreApi<{
      setActiveWallet: (wallet: Omit<Wallet, 'signer'>) => void;
      changeActiveWalletChainId: (chainID: number) => void;
      setConnectors: (connectors: Connector[]) => void;
      initTxPool: () => void;
    }>
  >;
  connectorsInitProps: AllConnectorsInitProps;
}

function Child({
  useStore,
  connectors,
}: Omit<Web3ProviderProps, 'connectorsInitProps'> & {
  connectors: Connector[];
}) {
  const { connector, chainId, isActive, accounts, provider } = useWeb3React();

  const setActiveWallet = useStore((state) => state.setActiveWallet);
  const changeChainID = useStore((state) => state.changeActiveWalletChainId);
  const setConnectors = useStore((state) => state.setConnectors);
  const initTxPool = useStore((state) => state.initTxPool);

  useEffect(() => {
    setConnectors(connectors);
  }, [connectors]);

  useEffect(() => {
    initTxPool();
  }, [initTxPool]);

  useEffect(() => {
    const walletType = connector && getConnectorName(connector);
    if (walletType && accounts && isActive && provider) {
      // TODO: don't forget to change to different
      setActiveWallet({
        walletType,
        accounts,
        chainId,
        provider,
        isActive,
      });
    }
  }, [isActive, chainId, provider, accounts]);

  useEffect(() => {
    if (chainId) {
      changeChainID(chainId);
    }
  }, [chainId]);
  return null;
}

export function Web3Provider({
  useStore,
  connectorsInitProps,
}: Web3ProviderProps) {
  const connectors = initAllConnectors(connectorsInitProps);
  return (
    <Web3ReactProvider connectors={connectors}>
      <Child
        useStore={useStore}
        connectors={connectors.map((connector) => connector[0])}
      />
    </Web3ReactProvider>
  );
}
