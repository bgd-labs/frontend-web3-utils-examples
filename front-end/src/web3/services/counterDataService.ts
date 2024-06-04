import { GelatoRelay, SponsoredCallRequest } from '@gelatonetwork/relay-sdk';
import { writeContract } from '@wagmi/core';
import { Client, encodeFunctionData, getContract } from 'viem';
import { Config } from 'wagmi';

import { COUNTER_ADDRESS, DESIRED_CHAIN_ID } from '../../utils/constants';
import { _abi as CounterAbi } from '../services/abi/CounterAbi';

export class CounterDataService {
  private counterFactory;
  private wagmiConfig: Config | undefined = undefined;

  constructor(client: Client) {
    this.counterFactory = getContract({
      address: COUNTER_ADDRESS,
      abi: CounterAbi,
      client: client,
    });
  }

  public connectSigner(wagmiConfig: Config) {
    this.wagmiConfig = wagmiConfig;
  }

  async fetchCurrentNumber() {
    return await this.counterFactory.read.getCurrentNumber();
  }

  async increment() {
    if (this.wagmiConfig) {
      return writeContract(this.wagmiConfig, {
        address: COUNTER_ADDRESS,
        abi: CounterAbi,
        functionName: 'increment',
      });
    } else {
      throw new Error('CONNECT YOUR SIGNER');
    }
  }

  async decrement() {
    if (this.wagmiConfig) {
      return writeContract(this.wagmiConfig, {
        address: COUNTER_ADDRESS,
        abi: CounterAbi,
        functionName: 'increment',
      });
    } else {
      throw new Error('CONNECT YOUR SIGNER');
    }
  }

  async incrementGelato() {
    if (this.wagmiConfig) {
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
    if (this.wagmiConfig) {
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
