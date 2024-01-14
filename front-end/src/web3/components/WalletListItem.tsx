import { WalletType } from '@bgd-labs/frontend-web3-utils';
import { getAccount } from '@wagmi/core';
import { useMemo } from 'react';

import { useStore } from '../../store';
import { DESIRED_CHAIN_ID } from '../../utils/constants';

export function WalletListItem({ walletType }: { walletType: WalletType }) {
  const {
    wagmiConfig,
    activeWallet,
    connectWallet,
    disconnectActiveWallet,
    setImpersonated,
  } = useStore();

  const isActive = useMemo(() => {
    return activeWallet?.walletType === walletType;
  }, [walletType, activeWallet]);

  const handleWalletClick = async () => {
    if (isActive) {
      if (wagmiConfig) {
        const acc = getAccount(wagmiConfig);
        console.log('acc', acc);
        console.log('acc conf', wagmiConfig);
      }
      await disconnectActiveWallet();
    } else {
      if (walletType === WalletType.Impersonated) {
        setImpersonated('0xAd9A211D227d2D9c1B5573f73CDa0284b758Ac0C'); // can be account address (view only mode) or private key;
      }
      await connectWallet(walletType, DESIRED_CHAIN_ID);
    }
  };

  return (
    <button onClick={handleWalletClick}>
      {isActive ? 'disconnect' : 'connect'}
      {walletType} {activeWallet?.chain?.id}
    </button>
  );
}
