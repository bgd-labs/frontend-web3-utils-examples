import { CounterSlice } from './counterSlice';

export const selectCurrentCounterValue = (store: CounterSlice) => {
  return store.counterValue ? store.counterValue.toString() : '';
};
