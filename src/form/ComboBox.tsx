import { Autocomplete, TextField, AutocompleteValue } from "@mui/material";
import { useField } from "./useField";
import { FieldHookConfig } from "formik/dist/Field";
import React, { SyntheticEvent } from "react";
import { UseAutocompleteProps } from "@mui/base/AutocompleteUnstyled/useAutocomplete";

type ComboBoxOption<V> = {
  value: V;
  label: string;
};

// todo: see how we can reuse logic from MUIFormControlWrapper
export function ComboBox<V>(
  props: Pick<
    UseAutocompleteProps<ComboBoxOption<V>, false, false, false>,
    "options"
  > &
    FieldHookConfig<V> & {
      label: string;
    }
) {
  const { field, hasError, helperText, helper } = useField(props);

  // TODO: consider indexing the options for faster lookup
  const selectedValue = props.options.find(
    (option) => option.value === field.value
  );

  return (
    <Autocomplete
      onChange={(
        event: SyntheticEvent,
        option: AutocompleteValue<ComboBoxOption<V>, false, false, false>
      ) => {
        option && helper.setValue(option.value);
      }}
      value={selectedValue}
      options={props.options}
      sx={{ width: 300 }} // todo: should be identical to the width of the text field
      renderInput={(params) => (
        <TextField
          {...params}
          variant="standard"
          label={props.label}
          error={hasError}
          helperText={helperText}
        />
      )}
    />
  );
}
