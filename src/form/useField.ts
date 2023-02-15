import {
  FieldHookConfig as FormikFieldHookConfig,
  useField as useFormikField,
} from "formik";

export type FieldHookConfig<V> = FormikFieldHookConfig<V> & {
  helperText?: string;
};

export function useField<V>(config: FieldHookConfig<V>) {
  const [field, meta, helper] = useFormikField(config);

  return {
    field,
    hasError: meta.touched && !!meta.error,
    helperText: meta.error ?? config.helperText,
    helper,
  } as const;
}
