// TODO: use this in the above function
import React, { FunctionComponent, ComponentClass } from "react";
import { FieldHookConfig } from "formik/dist/Field";
import { useField } from "formik";
import { FormControl, InputLabel, FormHelperText } from "@mui/material";

export type FormikFieldWrapperInnerComponentProps<V, P> = P & {
  touched: boolean;
  error?: string;
} & FieldHookConfig<V>;

// todo: remove if not neede
export function FormikFieldWrapper<V, P>(
  Component:
    | FunctionComponent<FormikFieldWrapperInnerComponentProps<V, P>>
    | ComponentClass<FormikFieldWrapperInnerComponentProps<V, P>>
) {
  return function NewComponent(
    props: P &
      FieldHookConfig<V> & {
        label: string;
        helperText?: string;
      }
  ) {
    const [field, meta, helpers] = useField(props);

    return (
      <Component
        {...props}
        {...field}
        touched={meta.touched}
        error={meta.error}
      />
    );
  };
}
