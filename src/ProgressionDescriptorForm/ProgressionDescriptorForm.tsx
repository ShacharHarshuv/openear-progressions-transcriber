import { Stack, Button } from "@mui/material";
import React, { useState } from "react";
import { Form, useFormik, FormikProvider } from "formik";
import { emptyProgressionDescriptor } from "../PorgressionDescriptor";
import { TextField } from "../form/TextField";
import { modes } from "../Mode";
import { ComboBox } from "../form/ComboBox";
import { noteTypes } from "../NoteType";
import { JsonViewer, getPrettyJson } from "../components/JsonViewer";
import * as Yup from "yup";
import YouTube from "react-youtube";
import type { YouTubePlayer } from "youtube-player/dist/types";
import { ChordsForm } from "./ChordsForm";
import { YoutubeUrlField } from "./YoutubeUrlField";

export function ProgressionDescriptorForm() {
  /**
   * TODO: find a more type safe of doing this
   * Perhaps we can unit initial values and schema together, so it's easier to add validations without losing the schema
   * */
  const schema = Yup.object().shape({
    name: Yup.string().required("Required"),
  });

  const formik = useFormik({
    initialValues: emptyProgressionDescriptor,
    onSubmit: (values) => {
      navigator.clipboard.writeText(getPrettyJson(values)).then(() => {
        alert("Copied to clipboard");
      });
    },
    validationSchema: schema,
  });

  const { values, resetForm } = formik;

  const [player, setPlayer] = useState<YouTubePlayer | null>(null);

  async function paste() {
    const text = await navigator.clipboard.readText();
    try {
      const parsed = JSON.parse(text);
      formik.setValues(parsed);
    } catch (e) {
      alert("Invalid JSON");
    }
  }

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
              <Button variant="outlined" onClick={() => paste()}>
                Paste
              </Button>
              <Button type="submit" variant="contained">
                Copy
              </Button>
            </Stack>
          </Stack>
          <JsonViewer value={values} />
        </Stack>
      </Form>
    </FormikProvider>
  );
}
