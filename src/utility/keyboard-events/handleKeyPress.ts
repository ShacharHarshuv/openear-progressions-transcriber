import React from "react";

export function handleOnKeyPress(
  key: string,
  callback: (event: React.KeyboardEvent) => void
) {
  return function (event: React.KeyboardEvent) {
    if (event.key !== key) {
      return;
    }

    event.preventDefault();
    callback(event);
  };
}
