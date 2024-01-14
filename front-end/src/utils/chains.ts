import { Chain } from 'viem';
import { goerli } from 'viem/chains';

// chains RPC urls
export const initialRpcUrls: Record<number, string[]> = {
  [goerli.id]: [
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
