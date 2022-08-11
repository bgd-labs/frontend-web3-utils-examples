export const getTransactionReceiptMock = jest.fn((hash: string) => {
  return {
    wait: () => {
      return new Promise((res) => {
        res({
          status: 1,
          hash,
        });
      });
    }
  }
});

export class MockedProvider {
  public getTransaction(hash: string) {
    return getTransactionReceiptMock(hash);
  }
}

export const checkAndSwitchNetwork = jest.fn(() => {});
export const createWeb3Slice = () => ({
  checkAndSwitchNetwork,
  l2Provider: new MockedProvider(),
  l1Provider: new MockedProvider(),
});
