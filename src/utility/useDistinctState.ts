import { Dispatch, SetStateAction, useState } from "react";

export function useDistinctState<S>(
  initialState: S
): [S, Dispatch<SetStateAction<S>>] {
  const [state, setState] = useState(initialState);
  const setDistinctState = (newStateOrGetter: SetStateAction<S>): void => {
    const newState =
      typeof newStateOrGetter === "function"
        ? (newStateOrGetter as (prevState: S) => S)(state)
        : newStateOrGetter;

    if (newState !== state) {
      setState(newState);
    }
  };
  return [state, setDistinctState];
}
