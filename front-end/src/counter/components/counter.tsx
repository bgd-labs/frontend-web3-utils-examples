import React, { useEffect } from "react";
import { useStore } from "../../store";
import { selectCurrentCounteValue } from "../store/counterSelectors";

export const Counter = () => {
  const getCounterValue = useStore((store) => store.getCounterValue);
  const loading = useStore((store) => store.counterLoading);
  const counterValue = useStore(selectCurrentCounteValue);

  const increment = useStore((store) => store.increment);
  const decrement = useStore((store) => store.decrement);
  const incrementGelato = useStore((store) => store.incrementGelato);
  const decrementGelato = useStore((store) => store.decrementGelato);

  useEffect(() => {
    getCounterValue();
  }, []);
  

  return (
    <div>
      <button onClick={increment}>+</button>
      {loading ? "loading" : counterValue}
      <button onClick={decrement}>-</button>
      <br />
      Gelato:
      <button onClick={incrementGelato}>+</button>
      <button onClick={decrementGelato}>-</button>
    </div>
  );
};
