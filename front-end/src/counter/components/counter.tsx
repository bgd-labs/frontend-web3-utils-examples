import React, { useEffect } from "react";
import { useStore } from "../../store";
import { selectCurrentCounteValue } from "../store/counterSelectors";

export const Counter = () => {
  const getCounterValue = useStore((store) => store.getCounterValue);
  const loading = useStore((store) => store.counterLoading);
  const counterValue = useStore(selectCurrentCounteValue);

  const increment = useStore((store) => store.increment);
  const decrement = useStore((store) => store.decrement);

  useEffect(() => {
    getCounterValue();
  }, []);
  

  return (
    <div>
      <button onClick={increment}>+</button>
      {loading ? "loading" : counterValue}
      <button onClick={decrement}>-</button>
    </div>
  );
};
