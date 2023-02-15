import { FieldHookConfig } from "formik/dist/Field";
import React, { FunctionComponent, ComponentClass } from "react";
import { FormControl, InputLabel, FormHelperText } from "@mui/material";
import { useField } from "./useField";

type InnerComponentProps<V, P> = P & {
  id: string;
} & FieldHookConfig<V>;

export function MUIFormControlWrapper<V, P>(
  Component:
    | FunctionComponent<InnerComponentProps<V, P>>
    | ComponentClass<InnerComponentProps<V, P>>
) {
  return function MuiFormControlWrapper(
    props: P &
      FieldHookConfig<V> & {
        label: string;
        helperText?: string;
      }
  ) {
    const { field, hasError, helperText } = useField(props);

    return (
      <FormControl variant="standard" error={hasError}>
        {/*TODO: consider generating an id that is guaranteed to be unique*/}
        <InputLabel htmlFor={field.name}>{props.label}</InputLabel>
        <Component {...props} {...field} id={field.name} />
        <FormHelperText>{helperText}</FormHelperText>
      </FormControl>
    );
  };
}
