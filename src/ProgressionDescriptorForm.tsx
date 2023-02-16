import { Stack, Button, IconButton, Grow } from "@mui/material";
import React from "react";
import { Formik, Form, FieldArray } from "formik";
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

  return (
    <Formik<ProgressionDescriptor>
      initialValues={emptyProgressionDescriptor}
      onSubmit={handleSubmit}
      validationSchema={schema}
    >
      {({ values, resetForm }) => (
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
                          <Stack alignItems="center" gap={2}>
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
      )}
    </Formik>
  );
}
