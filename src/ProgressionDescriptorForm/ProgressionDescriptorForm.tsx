import { Stack, Button, IconButton, Grow, Tooltip } from "@mui/material";
import React, { useCallback, useEffect, useState } from "react";
import { Form, FieldArray, useFormik, FormikProvider } from "formik";
import {
  emptyProgressionDescriptor,
  ProgressionDescriptor,
} from "../PorgressionDescriptor";
import { FormikConfig } from "formik/dist/types";
import { TextField } from "../form/TextField";
import { modes } from "../Mode";
import { ComboBox } from "../form/ComboBox";
import { noteTypes } from "../NoteType";
import { JsonViewer } from "../components/JsonViewer";
import * as Yup from "yup";
import { romanNumeralChordSymbolList } from "../RomanNumeral";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons/faPlus";
import { faTrash } from "@fortawesome/free-solid-svg-icons/faTrash";
import { Converter } from "../form/useField";
import YouTube from "react-youtube";
import type { YouTubePlayer } from "youtube-player/dist/types";
import { useIsPlaying } from "../utility/youtube/useIsPlaying";
import { useDerived } from "../utility/hooks/useDerived";
import { findPlayingSegmentIndex } from "../utility/findPlayingSegmentIndex";
import classNames from "classnames";
import { ChordsForm } from "./ChordsForm";
import { YoutubeUrlField } from "./YoutubeUrlField";

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

  const [player, setPlayer] = useState<YouTubePlayer | null>(null);

  return (
    <FormikProvider value={formik}>
      <Form>
        Input
        <input type={"text"} />
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
            <YoutubeUrlField label="URL" name="videoId" />
            <YouTube
              videoId={values.videoId}
              onReady={(event) => {
                setPlayer(event.target);
              }}
            />
            {/*TODO: add a button to play the video from the first chord*/}
            <ChordsForm {...{ player }} />
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
