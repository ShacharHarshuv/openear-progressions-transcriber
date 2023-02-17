import { Stack, Button, IconButton, Grow } from "@mui/material";
import React, { useEffect, useCallback } from "react";
import { Form, FieldArray, useFormik, FormikProvider } from "formik";
import {
  emptyProgressionDescriptor,
  ProgressionDescriptor,
} from "./PorgressionDescriptor";
import { FormikConfig } from "formik/dist/types";
import { TextField } from "./form/TextField";
import { modes } from "./Mode";
import { ComboBox } from "./form/ComboBox";
import { noteTypes } from "./NoteType";
import { JsonViewer } from "./components/JsonViewer";
import * as Yup from "yup";
import { romanNumeralChordSymbolList } from "./RomanNumeral";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons/faPlus";
import { faTrash } from "@fortawesome/free-solid-svg-icons/faTrash";
import { Converter } from "./form/useField";
import YouTube from "react-youtube";
import type { YouTubePlayer } from "youtube-player/dist/types";
import { useDistinctState } from "./utility/useDistinctState";
import { useIsPlaying } from "./utility/youtube/useIsPlaying";
import { useDerived } from "./utility/useDerived";
import { findLastIndex, findIndex } from "lodash";

export function ProgressionDescriptorForm() {
  const handleSubmit: FormikConfig<ProgressionDescriptor>["onSubmit"] = (
    values,
    formikHelpers
  ) => {
    console.log("handle submit");
    alert(JSON.stringify(values, null, 2));
  };

  /**
   * TODO: find a more type safe of doing this
   * Perhaps we can unit initial values and schema together, so it's easier to add validations without losing the schema
   * */
  const schema = Yup.object().shape({
    name: Yup.string().required("Required"),
  });

  const formik = useFormik({
    initialValues: emptyProgressionDescriptor,
    onSubmit: handleSubmit,
    validationSchema: schema,
  });

  const { values, resetForm } = formik;

  const [player, setPlayer] = useDistinctState<YouTubePlayer | null>(null);
  const isPlaying = useIsPlaying(player);
  const currentChordIndex = useDerived<number | null>(
    null,
    useCallback(
      (set) => {
        if (!isPlaying || !player) {
          set(null);
          return;
        }

        const interval = setInterval(async () => {
          const currentTime = await player.getCurrentTime();

          if (values.endSeconds && currentTime >= values.endSeconds) {
            set(null);
            return;
          }

          if (
            values.chords[0].seconds &&
            values.chords[0].seconds > currentTime
          ) {
            set(null);
            return;
          }

          const currentCodeIndex = findLastIndex(
            values.chords.filter((chord) => chord.seconds),
            (chord) => {
              return !!chord.seconds && currentTime >= chord.seconds;
            }
          );

          set(currentCodeIndex);
        });

        return () => clearInterval(interval);
      },
      [player, isPlaying, values.chords]
    )
  );

  useEffect(() => {
    console.log(isPlaying);
  }, [isPlaying]);

  // todo: it's impossible to type the converter because of how we did the MUIFormControlWrapper
  const youtubeUrlConverter: Converter<any> = {
    viewToModel: (url) => {
      const id = url.split("=")[1];
      if (!id) {
        throw new Error(`Invalid URL`);
      }
      return id;
    },
    modelToView: (id) => {
      return `https://www.youtube.com/watch?v=${id}`;
    },
  };

  return (
    <FormikProvider value={formik}>
      <Form>
        <Stack spacing={8} direction="row">
          <Stack spacing={2}>
            <Stack spacing={2} direction="row">
              <TextField label="Name" name="name" />
              {/*TODO: should be required*/}
              <TextField label="Artist" name="artist" />
              <TextField label="Section" name="section" />
              {/*TODO: could be auto-complete?*/}
            </Stack>
            <Stack spacing={2} direction="row">
              <ComboBox label="Tonic" name="key" options={noteTypes} />
              {/*TODO: should be combo box*/}
              <ComboBox name="mode" options={modes} label="Mode" />
              {/*TODO: should be combo box*/}
            </Stack>
            <TextField
              label="URL"
              name="videoId"
              converter={youtubeUrlConverter}
            />
            <YouTube
              videoId={values.videoId}
              onReady={(event) => {
                setPlayer(event.target);
              }}
            />
            {/*TODO: add a button to play the video from the first chord*/}
            <Stack
              spacing={2}
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
                          className={
                            index === currentChordIndex
                              ? "rounded-md border-4 p-2"
                              : ""
                          }
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
                          <IconButton
                            size="small"
                            onClick={() => remove(index)}
                          >
                            <FontAwesomeIcon icon={faTrash} />
                          </IconButton>
                        </Stack>
                      </Grow>
                    ))}
                    <IconButton onClick={() => push({})}>
                      <FontAwesomeIcon icon={faPlus} />
                    </IconButton>
                    <TextField
                      sx={{ width: 70 }}
                      name="endSeconds"
                      label="End"
                    />
                  </>
                )}
              </FieldArray>
            </Stack>
            <Stack spacing={2} direction="row" justifyContent="center">
              {/*TODO: consider adding a confirm action*/}
              <Button variant="outlined" onClick={() => resetForm()}>
                Clear
              </Button>
              <Button type="submit" variant="contained">
                Download
              </Button>
            </Stack>
          </Stack>
          <JsonViewer value={values} />
        </Stack>
      </Form>
    </FormikProvider>
  );
}
