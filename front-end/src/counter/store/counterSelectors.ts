import { CounterSlice } from "./counterSlice";

export const selectCurrentCounteValue = (store: CounterSlice) => {
  return store.counterValue ? store.counterValue.toString() : "";
};
