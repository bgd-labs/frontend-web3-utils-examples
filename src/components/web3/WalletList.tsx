'use client';

import { WalletType } from '@bgd-labs/frontend-web3-utils';
import React from 'react';

import { useStore } from '../../providers/ZustandStoreProvider';
import { WalletListItem } from './WalletListItem';

export const WalletList = () => {
  const activeWallet = useStore((store) => store.activeWallet);

  return (
    <div>
      <div>Wallet type Injected</div>
      <div>
        Account{' '}
        {activeWallet?.walletType === WalletType.Injected
          ? activeWallet.address
          : ''}
      </div>
      <WalletListItem walletType={WalletType.Injected} />

      <div>Wallet type Coinbase</div>
      <div>
        Account{' '}
        {activeWallet?.walletType === WalletType.Coinbase
          ? activeWallet.address
          : ''}
      </div>
      <WalletListItem walletType={WalletType.Coinbase} />

      <div>Wallet type Wallet connect</div>
      <div>
        Account{' '}
        {activeWallet?.walletType === WalletType.WalletConnect
          ? activeWallet.address
          : ''}
      </div>
      <WalletListItem walletType={WalletType.WalletConnect} />

      <div>
        Account{' '}
        {activeWallet?.walletType === WalletType.Safe
          ? activeWallet.address
          : ''}
      </div>
      <WalletListItem walletType={WalletType.Safe} />

      <div>Wallet type Impersonated</div>
      <div>
        Account{' '}
        {activeWallet?.walletType === WalletType.Impersonated
          ? activeWallet.address
          : ''}
      </div>
      <WalletListItem walletType={WalletType.Impersonated} />
    </div>
  );
};
