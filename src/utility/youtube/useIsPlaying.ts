import { YouTubePlayer } from "youtube-player/dist/types";
import { useEffect, useCallback, useState } from "react";

export function useIsPlaying(youtube: YouTubePlayer | null) {
  const [isPlaying, setIsPlaying] = useState(false);

  const listener = useCallback((event: CustomEvent) => {
    setIsPlaying((event as CustomEvent & { data: number }).data === 1);
  }, []);

  useEffect(() => {
    if (!youtube) {
      setIsPlaying(false);
      return;
    }

    youtube.addEventListener("onStateChange", listener);

    return () => {
      // TODO: that doesn't work for some reason
      // youtube.removeEventListener("stateChange", listener);
    };
  }, [youtube]);

  return isPlaying;
}
