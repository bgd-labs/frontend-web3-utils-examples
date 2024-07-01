import { Chain } from 'viem';
import { sepolia } from 'viem/chains';

// chains RPC urls
export const initialRpcUrls: Record<number, string[]> = {
  [sepolia.id]: [
    'https://eth-sepolia.public.blastapi.io',
    'https://endpoints.omniatech.io/v1/eth/sepolia/public',
    'https://ethereum-sepolia.blockpi.network/v1/rpc/public',
    'https://ethereum-sepolia.publicnode.com',
  ],
};

export function setChain(chain: Chain, url?: string) {
  return {
    ...chain,
    rpcUrls: {
      ...chain.rpcUrls,
      default: {
        ...chain.rpcUrls.default,
        http: [url || initialRpcUrls[chain.id][0], ...initialRpcUrls[chain.id]],
      },
    },
  };
}

export const CHAINS: Record<number, Chain> = {
  [sepolia.id]: setChain(sepolia),
};
