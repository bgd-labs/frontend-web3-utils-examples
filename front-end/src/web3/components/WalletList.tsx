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
        {activeWallet?.walletType === 'Metamask' ? activeWallet.account : ''}
      </div>
      <WalletListItem walletType="Metamask" />

      <div>Wallet type Coinbase</div>
      <div>
        Account{' '}
        {activeWallet?.walletType == 'Coinbase' ? activeWallet.account : ''}
      </div>
      <WalletListItem walletType="Coinbase" />

      <div>Wallet type Wallet connect</div>
      <div>
        Account{' '}
        {activeWallet?.walletType == 'WalletConnect'
          ? activeWallet.account
          : ''}
      </div>
      <WalletListItem walletType="WalletConnect" />

      <div>
        Account{' '}
        {activeWallet?.walletType == 'GnosisSafe'
          ? activeWallet.account
          : ''}
      </div>
      <WalletListItem walletType="GnosisSafe" />
    </div>
  );
};
