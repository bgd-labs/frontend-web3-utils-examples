import React, { useEffect } from 'react';

import { useStore } from '../../store';
import { useLastTxLocalStatus } from '../../transactions/useLastTxLocalStatus';
import { selectCurrentCounterValue } from '../store/counterSelectors';

export const Counter = () => {
  const store = useStore();
  const {
    getCounterValue,
    counterLoading,
    increment,
    decrement,
    incrementGelato,
    decrementGelato,
  } = store;

  const counterValue = selectCurrentCounterValue(store);

  const { executeTxWithLocalStatuses } = useLastTxLocalStatus({
    type: 'increment',
    payload: {},
  });

  useEffect(() => {
    getCounterValue();
  }, []);

  const handleIncrement = async () => {
    await executeTxWithLocalStatuses({
      callbackFunction: async () => await increment(),
    });
  };

  return (
    <div>
      <button onClick={handleIncrement}>+</button>
      {counterLoading ? 'loading' : counterValue}
      <button onClick={decrement}>-</button>
      <br />
      Gelato:
      <button onClick={incrementGelato}>+</button>
      <button onClick={decrementGelato}>-</button>
    </div>
  );
};
