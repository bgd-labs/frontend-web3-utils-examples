import React from 'react';
import { useStore } from '../../store';
import { WalletListItem } from './WalletListItem';


export const WalletList = () => {
  const activeWallet = useStore(store => store.activeWallet);

  return (
    <div>
      <div>Wallet type Metamask</div>
      <div>
        Account{' '}
        {activeWallet?.walletType === 'Metamask' ? activeWallet.accounts : ''}
      </div>
      <WalletListItem walletType="Metamask" />

      <div>Wallet type Coinbase</div>
      <div>
        Account{' '}
        {activeWallet?.walletType == 'Coinbase' ? activeWallet.accounts : ''}
      </div>
      <WalletListItem walletType="Coinbase" />

      <div>Wallet type Wallet connect</div>
      <div>
        Account{' '}
        {activeWallet?.walletType == 'WalletConnect'
          ? activeWallet.accounts
          : ''}
      </div>
      <WalletListItem walletType="WalletConnect" />
      <div>
        Account{' '}
        {activeWallet?.walletType == 'Impersonated'
          ? activeWallet.accounts
          : ''}
      </div>
      <WalletListItem walletType="Impersonated" />
    </div>
  );
};
