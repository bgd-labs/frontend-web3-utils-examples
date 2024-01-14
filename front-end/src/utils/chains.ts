import { Chain } from 'viem';
import { goerli } from 'viem/chains';

// chains RPC urls
export const initialRpcUrls: Record<number, string[]> = {
  [goerli.id]: [
    'https://rpc.tenderly.co/fork/699c7f48-de93-4f38-8bf3-6f341ace8f5d',
    'https://ethereum-goerli.publicnode.com',
    'https://goerli.blockpi.network/v1/rpc/public',
    'https://eth-goerli.public.blastapi.io',
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
  [goerli.id]: setChain(goerli),
};
