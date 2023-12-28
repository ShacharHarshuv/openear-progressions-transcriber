import { findLastIndex, isNil } from "lodash";

export function findPlayingSegmentIndex(
  currentTime: number,
  segments: readonly { readonly seconds: number }[],
  endTime: number
): number | null {
  // after last segment
  if (
    (!isNil(endTime) && currentTime >= endTime) ||
    !segments.length ||
    (!isNil(segments[0].seconds) && segments[0].seconds > currentTime)
  ) {
    return null;
  }

  return findLastIndex(
    segments.filter((segment) => segment.seconds),
    (chord) => {
      return !!chord.seconds && currentTime >= chord.seconds;
    }
  );
}
