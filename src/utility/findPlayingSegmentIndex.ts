import { findLastIndex } from "lodash";

export function findPlayingSegmentIndex(
  currentTime: number,
  segments: readonly { readonly seconds: number }[],
  endTime: number
): number | null {
  // after last segment
  if (
    (endTime && currentTime >= endTime) ||
    !segments.length ||
    (segments[0].seconds && segments[0].seconds > currentTime)
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
