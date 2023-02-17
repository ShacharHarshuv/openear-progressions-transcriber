import { TextField } from "../form/TextField";
import React from "react";
import { Converter } from "../form/useField";

export function YoutubeUrlField(props: { name: string; label?: string }) {
  // todo: it's impossible to type the converter because of how we did the MUIFormControlWrapper, this needs to be fixed
  const youtubeUrlConverter: Converter<any> = {
    viewToModel: (url) => {
      const id = url.split("=")[1];
      if (!id) {
        throw new Error(`Invalid URL`);
      }
      return id;
    },
    modelToView: (id) => {
      return `https://www.youtube.com/watch?v=${id}`;
    },
  };

  return <TextField {...props} converter={youtubeUrlConverter} />;
}
