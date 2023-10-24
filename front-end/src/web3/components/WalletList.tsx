import React from 'react';

import { useStore } from '../../store';
import { WalletListItem } from './WalletListItem';

export const WalletList = () => {
  const activeWallet = useStore((store) => store.activeWallet);

  return (
    <div>
      <div>Wallet type Injected</div>
      <div>
        Account{' '}
        {activeWallet?.walletType === 'Injected' ? activeWallet.address : ''}
      </div>
      <WalletListItem walletType="Injected" />

      <div>Wallet type Coinbase</div>
      <div>
        Account{' '}
        {activeWallet?.walletType === 'Coinbase' ? activeWallet.address : ''}
      </div>
      <WalletListItem walletType="Coinbase" />

      <div>Wallet type Wallet connect</div>
      <div>
        Account{' '}
        {activeWallet?.walletType === 'WalletConnect'
          ? activeWallet.address
          : ''}
      </div>
      <WalletListItem walletType="WalletConnect" />

      <div>
        Account{' '}
        {activeWallet?.walletType === 'GnosisSafe' ? activeWallet.address : ''}
      </div>
      <WalletListItem walletType="GnosisSafe" />

      <div>Wallet type Impersonated</div>
      <div>
        Account{' '}
        {activeWallet?.walletType === 'Impersonated'
          ? activeWallet.address
          : ''}
      </div>
      <WalletListItem walletType="Impersonated" />
    </div>
  );
};
