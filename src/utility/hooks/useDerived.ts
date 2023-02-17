import { useEffect, EffectCallback, useState } from "react";

export function useDerived<R>(
  initialValue: R,
  callback: (setValue: (r: R) => ReturnType<EffectCallback>) => void
): R {
  const [newValue, setNewValue] = useState(initialValue); // todo

  useEffect(() => {
    return callback(setNewValue);
  }, [callback]);

  return newValue;
}
