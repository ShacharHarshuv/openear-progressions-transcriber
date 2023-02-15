import React from "react";

export function JsonViewer(props: { value: object }) {
  return (
    <pre className="flex-grow rounded-lg bg-gray-200 p-6">
      {JSON.stringify(props.value, null, 2)}
    </pre>
  );
}
