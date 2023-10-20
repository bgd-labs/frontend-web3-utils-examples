import { BytesLike } from "ethers";
import { GelatoRelay, SponsoredCallRequest } from "@gelatonetwork/relay-sdk";
import { COUNTER_ADDRESS, DESIRED_CHAIN_ID } from "../../utils/constants";
import { getContract, encodeAbiParameters } from 'viem'
import { PublicClient, WalletClient } from "wagmi";


// TODO: replace this with the actual contract
const _abi = [
  {
    inputs: [],
    name: "decrement",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "getCurrentNumber",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "increment",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
];

export class CounterDataService {
  private counterFactory;
  private publicClient: PublicClient;
  private walletClient: WalletClient | null = null;;
  constructor(publicClient: PublicClient) {
    this.publicClient = publicClient;
    this.counterFactory = getContract({
      address: COUNTER_ADDRESS,
      abi: _abi,
      publicClient,
    })
  }

  public connectSigner(walletClient: WalletClient) {
    this.counterFactory = getContract({
      address: COUNTER_ADDRESS,
      abi: _abi,
      publicClient: this.publicClient,
      walletClient
    })
    this.walletClient = walletClient;
  }

  async fetchCurrentNumber() {
    return await this.counterFactory.read.getCurrentNumber();
  }

  async increment() {
    if (this.counterFactory && this.walletClient) {
      // TODO: update with wallet client check
      return this.counterFactory.write.increment()
    } else {
      throw new Error('CONNECT YOUR SIGNERSSSSS')
    }
  }

  async decrement() {
    if (this.counterFactory && this.walletClient) {
      // TODO: update with wallet client check
      return this.counterFactory.write.decrement();
    } else {
      throw new Error('CONNECT YOUR SIGNERSSSSS')
    }
  }

  async incrementGelato() {
    if (this.counterFactory) {
      const relay = new GelatoRelay();
      const data = encodeAbiParameters(_abi[2].inputs, []);
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
    if (this.counterFactory) {
      const relay = new GelatoRelay();
      // const { data } = await this.counterConnectedFactory.populateTransaction.decrement();
      const data = encodeAbiParameters(_abi[0].inputs, []);
      
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
