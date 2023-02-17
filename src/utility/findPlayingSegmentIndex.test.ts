import { findPlayingSegmentIndex } from "./findPlayingSegmentIndex";
import { testPureFunction } from "./test-utility/testPureFunction.test-utils";

function getSegments(seconds: number[]) {
  return seconds.map((seconds) => ({ seconds }));
}

const exampleSegments = [getSegments([36, 39, 42, 45]), 48] as const;

describe(findPlayingSegmentIndex.name, function () {
  testPureFunction(findPlayingSegmentIndex, [
    {
      args: [0, [], 10],
      returnValue: null,
    },
    {
      args: [35, ...exampleSegments],
      returnValue: null,
    },
    {
      args: [36, ...exampleSegments],
      returnValue: 0,
    },
    {
      args: [38, ...exampleSegments],
      returnValue: 0,
    },
    {
      args: [40, ...exampleSegments],
      returnValue: 1,
    },
    {
      args: [48, ...exampleSegments],
      returnValue: null,
    },
  ]);

  it("findPlayingSegmentIndex", () => {
    expect(findPlayingSegmentIndex(0, [], 10)).toBe(null);
  });
});
