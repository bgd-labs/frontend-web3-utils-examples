import { WalletType } from '../web3/connectors';
import { BaseTx, TransactionPool } from '../web3/store/transactionsSlice';

export enum LocalStorageKeys {
  LastConnectedWallet = 'LastConnectedWallet',
  TransactionPool = 'TransactionPool',
}

export const setLocalStorageTxPool = <T extends BaseTx>(
  pool: TransactionPool<T>
) => {
  const stringifiedPool = JSON.stringify(pool);
  localStorage.setItem(LocalStorageKeys.TransactionPool, stringifiedPool);
};

export const getLocalStorageTxPool = () => {
  return localStorage.getItem(LocalStorageKeys.TransactionPool);
};

export const setLocalStorageWallet = (walletType: WalletType) => {
  localStorage.setItem(LocalStorageKeys.LastConnectedWallet, walletType);
};

export const deleteLocalStorageWallet = () => {
  localStorage.removeItem(LocalStorageKeys.LastConnectedWallet);
};
