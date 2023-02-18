import React from "react";

export function getPrettyJson(value: object) {
  return JSON.stringify(value, null, 2);
}

export function JsonViewer(props: { value: object }) {
  return (
    <pre className="flex-grow rounded-lg bg-gray-200 p-6">
      {getPrettyJson(props.value)}
    </pre>
  );
}
