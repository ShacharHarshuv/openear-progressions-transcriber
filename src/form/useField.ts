import {
  FieldHookConfig as FormikFieldHookConfig,
  useField as useFormikField,
} from "formik";

export type Converter<V> = {
  readonly viewToModel: (value: V) => V;
  readonly modelToView: (value: V) => V;
};

export type FieldHookConfig<V> = FormikFieldHookConfig<V> & {
  readonly helperText?: string;
  readonly converter?: Converter<V>;
};

export function useField<V>(config: FieldHookConfig<V>) {
  const [field, meta, helper] = useFormikField(config);

  const converter = config.converter ?? {
    viewToModel: (value: V) => value,
    modelToView: (value: V) => value,
  };

  const { viewToModel, modelToView } = converter;

  return {
    field: {
      ...field,
      value: modelToView(field.value),
      // TODO: handle possible errors in the URL
      onChange: (event: React.ChangeEvent<any>) => {
        event.target.value = viewToModel(event.target.value);
        field.onChange(event);
      },
    },
    hasError: meta.touched && !!meta.error,
    helperText: meta.error ?? config.helperText,
    helper,
  } as const;
}
