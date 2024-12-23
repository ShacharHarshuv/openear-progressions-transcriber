import {
  Autocomplete,
  TextField,
  AutocompleteValue,
  AutocompleteProps,
} from "@mui/material";
import { useField } from "./useField";
import { FieldHookConfig } from "formik/dist/Field";
import React, { SyntheticEvent, useState, useEffect } from "react";

type ComboBoxOption<V> = {
  value: V;
  label: string;
};

function isComboBoxOptions<V>(
  option: readonly (ComboBoxOption<V> | string)[]
): option is ComboBoxOption<V>[] {
  return !(typeof option[0] === "string");
}

// todo: see how we can reuse logic from MUIFormControlWrapper
export function ComboBox<V>(
  props: Pick<
    AutocompleteProps<ComboBoxOption<V> | string, false, false, false>,
    "options" | "sx"
  > &
    FieldHookConfig<V> & {
      label?: string;
    }
) {
  const { field, hasError, helperText, helper } = useField(props);

  const options: readonly ComboBoxOption<V>[] = isComboBoxOptions(props.options)
    ? props.options
    : props.options.map(
        (opt): ComboBoxOption<V> => ({
          // todo: convince typescript it's correct without casting
          value: opt as unknown as V,
          label: opt as unknown as string,
        })
      );

  // TODO: consider indexing the options for faster lookup
  const selectedValue =
    options.find((option) => option.value === field.value) ?? null;

  return (
    <Autocomplete
      onChange={(
        event: SyntheticEvent,
        option: AutocompleteValue<ComboBoxOption<V>, false, false, false>
      ) => {
        option && helper.setValue(option.value);
      }}
      value={selectedValue}
      options={options}
      sx={props.sx ?? { width: 195 }} // todo: should be identical to the width of the text field, without writing explicitly
      renderInput={(params) => (
        <TextField
          {...params}
          variant="standard"
          label={props.label}
          error={hasError}
          helperText={helperText}
          onBlur={(event) => {
            const inputValue = event.target.value;
            if (!inputValue) {
              helper.setValue(null!);
            }

            const matchedValue = options.find(
              (option) => option.label === inputValue
            );
            console.log("matchedValue", matchedValue);
            if (matchedValue) {
              helper.setValue(matchedValue.value);
            }
          }}
        />
      )}
    />
  );
}
