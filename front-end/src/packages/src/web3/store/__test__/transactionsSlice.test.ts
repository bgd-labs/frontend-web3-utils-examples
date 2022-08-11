// import { useStore } from "../../../store";
// import { LocalStorageKeys } from "../../../utils/constants";
// import { setLocalStorageTxPool } from "../../../utils/localStorage";
// import { getTransactionReceiptMock } from "../../../web3/store/__mocks__/web3Slice";
// import {
//   CreateProposalTx,
//   TransactionPool,
//   VotingTx,
// } from "../transactionsSlice";

import { providers } from "ethers";
import create, { GetState, SetState } from "zustand";
import { StoreSlice } from "../../../types/store";
import { LocalStorageKeys } from "../../../utils/localStorage";
import {
  BaseTx,
  ITransactionsSlice,
  createTransactionsSlice as createBaseTransactionsSlice,
} from "../transactionsSlice";
import { Web3Slice } from "../walletSlice";
import { createWeb3Slice, MockedProvider } from "../__mocks__/web3";

type SomeRandomTx = BaseTx & {
  type: "SomerandomTx";
};

const providersRecord = {
  0: new MockedProvider() as any,
};

type TestTXWithComplexPayload = BaseTx & {
  type: "TestTXWithComplexPayload";
  payload: {
    fizz: "fizz";
  };
};

type TestTxWithSimplePayload = BaseTx & {
  type: "TestTXWithSimplePayload";
  payload: {};
};

type TransactionUnion = TestTXWithComplexPayload | TestTxWithSimplePayload;

export type TransactionsSlice = ITransactionsSlice<TransactionUnion> & {};

const callbackObserver = jest.fn();

export const createTransactionsSlice: StoreSlice<TransactionsSlice, any> = (
  set,
  get
) => ({
  ...(createWeb3Slice() as any),
  ...createBaseTransactionsSlice<TransactionUnion>({
    callbackObserver,
    providers: providersRecord,
  })(set, get),
});

type RootState = TransactionsSlice;

const createRootSlice = (
  set: SetState<RootState>,
  get: GetState<RootState>
) => ({
  ...createTransactionsSlice(set, get),
});

const useStore = create(createRootSlice);

describe("Transactions slice", () => {
  const tx = {
    hash: "0x0000000",
    chainId: 0,
    from: "0x00001",
    nonce: 1,
    to: "0x0002",
  };
  it("Should add tx to poll and call wait", async () => {
    const waitForTx = jest.fn();
    useStore.setState({
      waitForTx,
    });

    useStore.getState().addTx({
      type: "TestTXWithSimplePayload",
      tx,
      payload: {},
    });

    expect(
      JSON.parse(localStorage.getItem(LocalStorageKeys.TransactionPool) || "")[
        tx.hash
      ]
    ).toEqual({
      ...tx,
      type: "TestTXWithSimplePayload",
      payload: {},
      pending: true,
    });

    expect(waitForTx).toBeCalledWith(tx.hash);
  });

  it("Should wait for tx, call callback and remove tx from poll", async () => {
    const callbackObserver = jest.fn();
    useStore.setState({
      callbackObserver,
    });

    await useStore.getState().executeTx({
      body: () => {
        return new Promise((resolve) => resolve())
      },
      params: {
        type: "TestTXWithSimplePayload",
        payload: {},
      },
    });
    expect(callbackObserver).toBeCalledWith({
      type: "TestTXWithSimplePayload",
      ...tx,
      pending: false,
      status: 1,
      payload: {},
    });
  });

  // it("Should remove tx from localStorage", () => {
  //   useStore.setState({
  //     transactionsPool: {
  //       [voteTx.hash]: voteTx,
  //       [createProposalTx.hash]: createProposalTx,
  //     },
  //   });

  //   useStore.getState().removeTx(voteTx.hash);
  //   expect(Object.keys(useStore.getState().transactionsPool)).toEqual([
  //     createProposalTx.hash,
  //   ]);
  //   expect(
  //     Object.keys(
  //       JSON.parse(localStorage.getItem(LocalStorageKeys.TransactionPool) || "")
  //     )
  //   ).toEqual([createProposalTx.hash]);
  // });

  // it("should initTxPool from localstoraget and wait for all txs", () => {
  //   const transactionPool: TransactionPool = {
  //     [voteTx.hash]: voteTx,
  //     [createProposalTx.hash]: createProposalTx,
  //   };
  //   setLocalStorageTxPool(transactionPool);
  //   const waitForTx = jest.fn();
  //   useStore.setState({
  //     waitForTx,
  //   });
  //   useStore.getState().initTxPool();
  //   expect(useStore.getState().transactionsPool).toEqual(transactionPool);
  //   expect(waitForTx).toBeCalledTimes(2);
  // });

  // it("Should call get detailed proposal when create proposal tx is minted", () => {
  //   const getNewProposalIds = jest.fn();
  //   useStore.setState({
  //     getNewProposalIds,
  //   });
  //   useStore.getState().callbackObserver(createProposalTx);
  //   expect(getNewProposalIds).toBeCalled();
  // });

  // it("Should fetch latest proposal data after voting", () => {
  //   const getDetailedProposalsData = jest.fn();
  //   useStore.setState({
  //     getDetailedProposalsData,
  //   });
  //   useStore.getState().callbackObserver(voteTx);
  //   expect(getDetailedProposalsData).toBeCalledWith([
  //     voteTx.payload.proposalId,
  //   ]);
  // });
});
