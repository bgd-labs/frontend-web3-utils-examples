import { WalletType } from '@bgd-labs/frontend-web3-utils';
import { useMemo } from 'react';

import { useStore } from '../../store';

export function WalletListItem({ walletType }: { walletType: WalletType }) {
  const activeWallet = useStore((store) => store.activeWallet);
  const connectWallet = useStore((state) => state.connectWallet);
  const disconnectActiveWallet = useStore(
    (state) => state.disconnectActiveWallet,
  );

  const isActive = useMemo(() => {
    return activeWallet?.walletType === walletType;
  }, [walletType, activeWallet]);

  const handleWalletClick = async () => {
    if (isActive) {
      await disconnectActiveWallet();
    } else {
      await connectWallet(walletType);
    }
  };

  return (
    <button onClick={handleWalletClick}>
      {isActive ? 'disconnect' : 'connect'}
      {walletType} {activeWallet?.chain?.id}
    </button>
  );
}
