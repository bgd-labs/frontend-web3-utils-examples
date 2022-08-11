import { providers } from "ethers";
import { SimpleStorage, SimpleStorage__factory } from "../contracts";

export class IncrementDartaService {
  private rpcProvider: providers.JsonRpcBatchProvider;
  private incrementFactory: SimpleStorage;
  constructor(provider: providers.JsonRpcBatchProvider) {
    this.rpcProvider = provider;
    this.incrementFactory = SimpleStorage__factory.connect(
      "0x5fbdb2315678afecb367f032d93f642f64180aa3",
      this.rpcProvider
    );
  }

  async fetchCurrentNumber() {
    return await this.incrementFactory.getCurrentNumber();
  }
  
  async decrement() {}

  async increment() {}

}
