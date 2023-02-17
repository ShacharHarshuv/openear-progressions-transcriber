import { useEffect, EffectCallback } from "react";
import { useDistinctState } from "./useDistinctState";

export function useDerived<R>(
  initialValue: R,
  callback: (setValue: (r: R) => ReturnType<EffectCallback>) => void
): R {
  const [newValue, setNewValue] = useDistinctState(initialValue);

  useEffect(() => {
    return callback(setNewValue);
  }, [callback]);

  return newValue;
}
