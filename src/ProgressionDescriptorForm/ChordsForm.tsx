import {
  Stack,
  IconButton,
  Typography,
  Tooltip,
  Input,
  FormControl,
  InputLabel,
} from "@mui/material";
import { FieldArray, useFormikContext } from "formik";
import { ComboBox } from "../form/ComboBox";
import { romanNumeralChordSymbolList } from "../RomanNumeral";
import { TextField } from "../form/TextField";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons/faTrash";
import { faPlus } from "@fortawesome/free-solid-svg-icons/faPlus";
import React, { useCallback, ReactElement, useState } from "react";
import { ProgressionDescriptor } from "../PorgressionDescriptor";
import { useDerived } from "../utility/hooks/useDerived";
import { findPlayingSegmentIndex } from "../utility/findPlayingSegmentIndex";
import { useIsPlaying } from "../utility/youtube/useIsPlaying";
import { YouTubePlayer } from "youtube-player/dist/types";
import { round, update } from "lodash";
import { handleOnKeyPress } from "../utility/keyboard-events/handleKeyPress";
import { faPlay } from "@fortawesome/free-solid-svg-icons/faPlay";
import { faPause } from "@fortawesome/free-solid-svg-icons/faPause";

export function ChordsForm({ player }: { player: YouTubePlayer | null }) {
  const { values, setValues } = useFormikContext<ProgressionDescriptor>();
  const chords = values.chords;

  const isPlaying = useIsPlaying(player);
  const currentChordIndex = useCurrentChordIndex({
    player,
    values,
    isPlaying,
  });

  const renderRow = getRenderRow(values.chords);

  const [delay, setDelay] = useState(-0.2);

  const setCurrentTime = useCallback(
    async (event: Pick<React.KeyboardEvent, "target">) => {
      const name = (event.target as { name?: string }).name;

      if (!player || !name) {
        return;
      }

      const currentTime = round((await player.getCurrentTime()) + delay, 2);

      setValues((prevValues: ProgressionDescriptor) => {
        update(prevValues, name, () => currentTime);
        return prevValues;
      });
    },
    [player, setValues]
  );

  function handleDelayChange(event: React.ChangeEvent<HTMLInputElement>) {
    const newDelay = Number(event.target.value);
    const previousDelay = delay;
    const difference = newDelay - previousDelay;
    setDelay(newDelay);
    setValues((prevValues: ProgressionDescriptor) => ({
      ...prevValues,
      chords: prevValues.chords.map((chord) => ({
        ...chord,
        seconds: round(chord.seconds + difference, 2),
      })),
      endSeconds: round(prevValues.endSeconds + difference, 2),
    }));
  }

  return (
    <Stack spacing={1} alignItems="center" justifyContent="center">
      <Stack
        spacing={1}
        alignItems="center"
        justifyContent="center"
        direction="row"
      >
        <Tooltip title="Play progression from the beginning">
          <IconButton
            onClick={useCallback(() => {
              if (!player) {
                return;
              }
              if (isPlaying) {
                player.pauseVideo();
              } else {
                player.seekTo(values.chords[0].seconds, true);
                player.playVideo();
              }
            }, [player, isPlaying, values.chords[0].seconds])}
          >
            <FontAwesomeIcon icon={isPlaying ? faPause : faPlay} />
          </IconButton>
        </Tooltip>
        <FieldArray name="chords">
          {({ push, remove }) => (
            <>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: `repeat(${chords.length + 1}, 1fr)`,
                  gap: "1rem",
                  justifyItems: "center",
                  alignItems: "end",
                  padding: "1rem",
                }}
              >
                <CurrentChordIndication {...{ currentChordIndex }} />
                {renderRow(
                  (name) => (
                    <ComboBox
                      sx={{ width: 70 }}
                      name={`${name}.chord`}
                      options={romanNumeralChordSymbolList}
                    />
                  ),
                  <IconButton onClick={() => push({})}>
                    <FontAwesomeIcon icon={faPlus} />
                  </IconButton>
                )}
                {renderRow(
                  (name, index) => (
                    <TextField
                      sx={{ width: 70 }}
                      name={`${name}.seconds`}
                      inputProps={{
                        type: "number",
                      }}
                      onKeyPress={handleOnKeyPress(" ", async (event) => {
                        setCurrentTime(event);

                        // Move to next field
                        setTimeout(() => {
                          const nextField = document.getElementById(
                            `chords.${index + 1}.seconds`
                          );

                          if (nextField) {
                            nextField.focus();
                          } else {
                            document.getElementById("endSeconds")?.focus();
                          }
                        });
                      })}
                    />
                  ),
                  <TextField
                    sx={{ width: 70 }}
                    name="endSeconds"
                    label="End"
                    onKeyPress={handleOnKeyPress(" ", async (event) => {
                      event.preventDefault();
                      setCurrentTime(event);
                    })}
                  />,
                  <Tooltip title="Enter value to compensate for real time playing delay">
                    <FormControl>
                      <InputLabel>Delay</InputLabel>
                      <Input
                        sx={{ width: 70 }}
                        inputProps={{
                          type: "number",
                          step: 0.1,
                        }}
                        onChange={handleDelayChange}
                        value={delay}
                      />
                    </FormControl>
                  </Tooltip>
                )}
                {renderRow((_, index) => (
                  <IconButton size="small" onClick={() => remove(index)}>
                    <FontAwesomeIcon icon={faTrash} />
                  </IconButton>
                ))}
              </div>
            </>
          )}
        </FieldArray>
      </Stack>
      <Typography variant="body1">
        Press "Space" when on a timestamp to set the time to the current time.
      </Typography>
    </Stack>
  );
}

function CurrentChordIndication({
  currentChordIndex,
}: {
  currentChordIndex: number | null;
}) {
  return (
    <>
      {currentChordIndex !== null && (
        <div
          className="rounded-md border-2 border-gray-300 p-2"
          style={{
            gridArea: `1 / ${currentChordIndex + 1} / 5 / ${
              currentChordIndex + 1
            } `,
            justifySelf: "stretch",
            alignSelf: "stretch",
            margin: "-0.5rem",
            padding: "0.5rem",
          }}
        />
      )}
    </>
  );
}

function useCurrentChordIndex({
  player,
  isPlaying,
  values,
}: {
  player: YouTubePlayer | null;
  isPlaying: boolean;
  values: Pick<ProgressionDescriptor, "chords" | "endSeconds">;
}) {
  // todo: is it correct to use useCallback here?
  return useDerived<number | null>(
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

          const playingSegmentIndex = findPlayingSegmentIndex(
            currentTime,
            values.chords,
            values.endSeconds
          );
          set(playingSegmentIndex);
        });

        // todo: consider subscribing the seek change events as well

        return () => {
          clearInterval(interval);
        };
      },
      [player, isPlaying, values.chords]
    )
  );
}

type RowRenderFn = (name: string, index: number) => ReactElement;

export function getRenderRow(chords: ProgressionDescriptor["chords"]) {
  let rowIndex = 0;

  return function renderRow(renderFn: RowRenderFn, ...rest: ReactElement[]) {
    const currentRow = rowIndex++;

    const elements = chords
      .map((element, index) => renderFn(`chords.${index}`, index))
      .concat(rest);

    return (
      <>
        {elements.map((elm, index) => (
          <span
            key={index}
            style={{
              gridArea: `${currentRow + 1} / ${index + 1} / ${
                currentRow + 1
              } / ${index + 1}`,
            }}
          >
            {elm}
          </span>
        ))}
      </>
    );
  };
}
