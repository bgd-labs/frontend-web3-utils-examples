import { GelatoRelay, SponsoredCallRequest } from '@gelatonetwork/relay-sdk';
import {
  encodeFunctionData,
  getContract,
  PublicClient,
  WalletClient,
} from 'viem';

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
  private connectedContractFactory;
  private publicClient: PublicClient;
  private walletClient: WalletClient | null = null;
  constructor(publicClient: PublicClient) {
    this.publicClient = publicClient;
    this.counterFactory = getContract({
      address: COUNTER_ADDRESS,
      abi: _abi,
      publicClient,
    });
    if (this.walletClient) {
      this.connectedContractFactory = getContract({
        address: COUNTER_ADDRESS,
        abi: this.counterFactory.abi,
        publicClient: this.publicClient,
        walletClient: this.walletClient,
      });
    }
  }

  public connectSigner(walletClient: WalletClient) {
    this.connectedContractFactory = getContract({
      address: COUNTER_ADDRESS,
      abi: this.counterFactory.abi,
      publicClient: this.publicClient,
      walletClient: walletClient,
    });
    this.walletClient = walletClient;
  }

  async fetchCurrentNumber() {
    return await this.counterFactory.read.getCurrentNumber();
  }

  async increment() {
    if (this.connectedContractFactory) {
      // @ts-ignore
      return this.connectedContractFactory.write.increment();
    } else {
      throw new Error('CONNECT YOUR SIGNERSSSSS');
    }
  }

  async decrement() {
    if (this.connectedContractFactory) {
      // @ts-ignore
      return this.connectedContractFactory.write.decrement();
    } else {
      throw new Error('CONNECT YOUR SIGNERSSSSS');
    }
  }

  async incrementGelato() {
    if (this.connectedContractFactory) {
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
    if (this.connectedContractFactory) {
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
