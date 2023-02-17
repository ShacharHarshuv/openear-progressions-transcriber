import { Stack, Grow, IconButton, Tooltip, Button } from "@mui/material";
import { FieldArray, useFormikContext } from "formik";
import classNames from "classnames";
import { ComboBox } from "../form/ComboBox";
import { romanNumeralChordSymbolList } from "../RomanNumeral";
import { TextField } from "../form/TextField";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons/faTrash";
import { faPlus } from "@fortawesome/free-solid-svg-icons/faPlus";
import React, { useCallback } from "react";
import { ProgressionDescriptor } from "../PorgressionDescriptor";
import { useDerived } from "../utility/hooks/useDerived";
import { findPlayingSegmentIndex } from "../utility/findPlayingSegmentIndex";
import { useIsPlaying } from "../utility/youtube/useIsPlaying";
import { YouTubePlayer } from "youtube-player/dist/types";

export function ChordsForm({ player }: { player: YouTubePlayer | null }) {
  const { values } = useFormikContext<ProgressionDescriptor>();

  const isPlaying = useIsPlaying(player);
  const currentChordIndex = useDerived<number | null>(
    null,
    useCallback(
      (set) => {
        if (!player) {
          set(null);
          return;
        }

        if (!isPlaying) {
          return;
        }

        const interval = setInterval(async () => {
          const currentTime = await player.getCurrentTime();

          set(
            findPlayingSegmentIndex(
              currentTime,
              values.chords,
              values.endSeconds
            )
          );
        });

        // todo: consider subscribing the seek change events as well

        return () => {
          clearInterval(interval);
        };
      },
      [player, isPlaying, values.chords]
    )
  );

  return (
    <Stack
      spacing={1}
      direction="row"
      alignItems="center"
      justifyContent="center"
    >
      <FieldArray name="chords">
        {({ push, remove }) => (
          <>
            {values.chords.map((chord, index) => (
              <Grow in={true} key={index}>
                <Stack
                  alignItems="center"
                  gap={2}
                  className={classNames("rounded-md border-4 p-2", {
                    "border-transparent": index !== currentChordIndex,
                  })}
                >
                  <ComboBox
                    sx={{ width: 70 }}
                    name={`chords.${index}.chord`}
                    options={romanNumeralChordSymbolList}
                  />
                  <TextField
                    sx={{ width: 70 }}
                    name={`chords.${index}.seconds`}
                    inputProps={{
                      type: "number",
                    }}
                  />
                  <IconButton size="small" onClick={() => remove(index)}>
                    <FontAwesomeIcon icon={faTrash} />
                  </IconButton>
                </Stack>
              </Grow>
            ))}
            <IconButton onClick={() => push({})}>
              <FontAwesomeIcon icon={faPlus} />
            </IconButton>
            <TextField sx={{ width: 70 }} name="endSeconds" label="End" />
          </>
        )}
      </FieldArray>
      <Tooltip title="Use this to set the value of the currently focused field">
        <Button
          onClick={() => {
            const focusedElement = document.activeElement;
            console.log(focusedElement);
          }}
        >
          Now
        </Button>
      </Tooltip>
    </Stack>
  );
}
