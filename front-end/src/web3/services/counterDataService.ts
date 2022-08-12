import { providers } from "ethers";
import { COUNTER_ADDRESS } from "../../utils/constants";
import { Counter } from "../contracts/Counter";
import { Counter__factory } from "../contracts/factories/Counter__factory";

export class CounterDataService {
  private rpcProvider: providers.JsonRpcBatchProvider;
  private counterFactory: Counter;
  private signer?: providers.JsonRpcSigner;
  constructor(provider: providers.JsonRpcBatchProvider) {
    this.rpcProvider = provider;
    this.counterFactory = Counter__factory.connect(
      COUNTER_ADDRESS,
      this.rpcProvider
    );
  }

  public connectSigner(signer: providers.JsonRpcSigner) {
    this.signer = signer;
  }

  async fetchCurrentNumber() {
    return await this.counterFactory.getCurrentNumber();
  }

  async increment() {
    if (this.signer) {
      const connectedSigner = this.counterFactory.connect(this.signer);
      return connectedSigner.increment()
    } else {
      throw new Error('CONNECT YOUR SIGNERSSSSS')
    }
  }

  async decrement() {
    if (this.signer) {
      const connectedSigner = this.counterFactory.connect(this.signer);
      return connectedSigner.decrement();
    } else {
      throw new Error('CONNECT YOUR SIGNERSSSSS')
    }
  }
}
