'use client';

import React, { useEffect } from 'react';

import { useStore } from '../../store/ZustandStoreProvider';
import { useLastTxLocalStatus } from '../../transactions/useLastTxLocalStatus';
import { selectCurrentCounterValue } from '../store/counterSelectors';

export const Counter = () => {
  const getCounterValue = useStore((store) => store.getCounterValue);
  const counterLoading = useStore((store) => store.counterLoading);
  const increment = useStore((store) => store.increment);
  const decrement = useStore((store) => store.decrement);
  const incrementGelato = useStore((store) => store.incrementGelato);
  const decrementGelato = useStore((store) => store.decrementGelato);

  const counterValue = useStore((store) => selectCurrentCounterValue(store));

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
