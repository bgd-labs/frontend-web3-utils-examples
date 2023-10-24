import { WalletType } from '@bgd-labs/frontend-web3-utils';
import { useMemo } from 'react';

import { useStore } from '../../store';
import { DESIRED_CHAIN_ID } from '../../utils/constants';

export function WalletListItem({ walletType }: { walletType: WalletType }) {
  const {
    activeWallet,
    connectWallet,
    disconnectActiveWallet,
    setImpersonatedAccount,
  } = useStore();

  const isActive = useMemo(() => {
    return activeWallet?.walletType === walletType;
  }, [walletType, activeWallet]);

  const handleWalletClick = async () => {
    if (isActive) {
      await disconnectActiveWallet();
    } else {
      if (walletType === 'Impersonated') {
        setImpersonatedAccount('0x...'); // should be private key with 0x;
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
