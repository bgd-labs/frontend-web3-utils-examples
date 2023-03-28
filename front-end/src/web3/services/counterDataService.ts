import { providers, BytesLike } from "ethers";
import { GelatoRelay, SponsoredCallRequest } from "@gelatonetwork/relay-sdk";
import { COUNTER_ADDRESS, DESIRED_CHAIN_ID } from "../../utils/constants";
import { Counter } from "../contracts/Counter";
import { Counter__factory } from "../contracts/factories/Counter__factory";

export class CounterDataService {
  private counterFactory: Counter;
  private counterConnectedFactory?: Counter;
  constructor(provider: providers.JsonRpcBatchProvider) {
    this.counterFactory = Counter__factory.connect(
      COUNTER_ADDRESS,
      provider
    );
  }

  public connectSigner(signer: providers.JsonRpcSigner) {
    this.counterConnectedFactory = this.counterFactory.connect(signer);
  }

  async fetchCurrentNumber() {
    return await this.counterFactory.getCurrentNumber();
  }

  async increment() {
    if (this.counterConnectedFactory) {
      return this.counterConnectedFactory.increment()
    } else {
      throw new Error('CONNECT YOUR SIGNERSSSSS')
    }
  }

  async decrement() {
    if (this.counterConnectedFactory) {
      return this.counterConnectedFactory.decrement();
    } else {
      throw new Error('CONNECT YOUR SIGNERSSSSS')
    }
  }

  async incrementGelato() {
    if (this.counterConnectedFactory) {
      const relay = new GelatoRelay();
      const { data } = await this.counterConnectedFactory.populateTransaction.increment();
      
      const request: SponsoredCallRequest = {
        chainId: DESIRED_CHAIN_ID,
        target: COUNTER_ADDRESS,
        data: data as BytesLike,
      };

      return relay.sponsoredCall(
        request,
        process.env.NEXT_PUBLIC_GELATO_API_KEY || '',
      );
    } else {
      throw new Error('CONNECT YOUR SIGNERSSSSS')
    }
  }

  async decrementGelato() {
    if (this.counterConnectedFactory) {
      const relay = new GelatoRelay();
      const { data } = await this.counterConnectedFactory.populateTransaction.decrement();
      
      const request: SponsoredCallRequest = {
        chainId: DESIRED_CHAIN_ID,
        target: COUNTER_ADDRESS,
        data: data as BytesLike,
      };

      return relay.sponsoredCall(
        request,
        process.env.NEXT_PUBLIC_GELATO_API_KEY || '',
      );
    } else {
      throw new Error('CONNECT YOUR SIGNERSSSSS')
    }
  }
}
