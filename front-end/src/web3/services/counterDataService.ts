import { GelatoRelay, SponsoredCallRequest } from '@gelatonetwork/relay-sdk';
import { PublicClient, WalletClient } from '@wagmi/core';
import { encodeFunctionData, getContract } from 'viem';

import { COUNTER_ADDRESS, DESIRED_CHAIN_ID } from '../../utils/constants';

// TODO: replace this with the actual contract
const _abi = [
  {
    inputs: [],
    name: 'decrement',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'getCurrentNumber',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'increment',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
] as const;

export class CounterDataService {
  private counterFactory;
  private publicClient: PublicClient;
  private walletClient: WalletClient | undefined = undefined;
  constructor(publicClient: PublicClient) {
    this.publicClient = publicClient;
    this.counterFactory = getContract({
      address: COUNTER_ADDRESS,
      abi: _abi,
      publicClient,
      walletClient: this.walletClient,
    });
  }

  public connectSigner(walletClient: WalletClient) {
    this.walletClient = walletClient;
    this.counterFactory = getContract({
      address: this.counterFactory.address,
      abi: this.counterFactory.abi,
      publicClient: this.publicClient,
      walletClient: this.walletClient,
    });
  }

  async fetchCurrentNumber() {
    return await this.counterFactory.read.getCurrentNumber();
  }

  async increment() {
    if (this.walletClient) {
      // @ts-ignore
      return this.counterFactory.write.increment();
    } else {
      throw new Error('CONNECT YOUR SIGNERSSSSS');
    }
  }

  async decrement() {
    if (this.walletClient) {
      // @ts-ignore
      return this.counterFactory.write.decrement();
    } else {
      throw new Error('CONNECT YOUR SIGNERSSSSS');
    }
  }

  async incrementGelato() {
    if (this.walletClient) {
      const relay = new GelatoRelay();
      const data = encodeFunctionData({
        abi: this.counterFactory.abi,
        functionName: 'increment',
      });

      const request: SponsoredCallRequest = {
        chainId: BigInt(DESIRED_CHAIN_ID),
        target: COUNTER_ADDRESS,
        data: data,
      };

      return relay.sponsoredCall(
        request,
        process.env.NEXT_PUBLIC_GELATO_API_KEY || '',
      );
    } else {
      throw new Error('CONNECT YOUR SIGNERSSSSS');
    }
  }

  async decrementGelato() {
    if (this.walletClient) {
      const relay = new GelatoRelay();
      const data = encodeFunctionData({
        abi: this.counterFactory.abi,
        functionName: 'decrement',
      });

      const request: SponsoredCallRequest = {
        chainId: BigInt(DESIRED_CHAIN_ID),
        target: COUNTER_ADDRESS,
        data: data,
      };

      return relay.sponsoredCall(
        request,
        process.env.NEXT_PUBLIC_GELATO_API_KEY || '',
      );
    } else {
      throw new Error('CONNECT YOUR SIGNERSSSSS');
    }
  }
}
