import { WalletType } from '@bgd-labs/frontend-web3-utils';
import { useMemo } from 'react';

import { useStore } from '../../store';
import { DESIRED_CHAIN_ID } from '../../utils/constants';

export function WalletListItem({ walletType }: { walletType: WalletType }) {
  const {
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
      await disconnectActiveWallet();
    } else {
      if (walletType === WalletType.Impersonated) {
        setImpersonated(''); // can be account address (view only mode) or private key;
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
