import { NoteType } from "./NoteType";
import { Mode } from "./Mode";

export type ProgressionDescriptor = {
  name: string;
  artist?: string;
  section?: string;
  key: NoteType;
  mode: Mode;
};

export const emptyProgressionDescriptor: ProgressionDescriptor = {
  name: "",
  key: "C",
  mode: Mode.Ionian,
  artist: "",
  section: "",
};
