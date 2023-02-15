import { Stack, Button } from "@mui/material";
import React from "react";
import { Formik, Form } from "formik";
import {
  emptyProgressionDescriptor,
  ProgressionDescriptor,
} from "./PorgressionDescriptor";
import { FormikConfig } from "formik/dist/types";
import { TextField } from "./form/TextField";
import { modes } from "./Mode";
import { ComboBox } from "./form/ComboBox";
import { noteTypes } from "./NoteType";

export function ProgressionDescriptorForm() {
  const handleSubmit: FormikConfig<ProgressionDescriptor>["onSubmit"] = (
    values,
    formikHelpers
  ) => {
    console.log("handle submit");
    alert(JSON.stringify(values, null, 2));
  };

  return (
    <Formik initialValues={emptyProgressionDescriptor} onSubmit={handleSubmit}>
      {({ values }) => (
        <Form>
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
            <Button type="submit">Save</Button>
            {/*TODO*/}
            <pre>{JSON.stringify(values, null, 2)}</pre>
          </Stack>
        </Form>
      )}
    </Formik>
  );
}
