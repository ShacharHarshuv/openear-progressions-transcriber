import { NoteType } from "./NoteType";
import { Mode } from "./Mode";
import { RomanNumeral } from "./RomanNumeral";

export type ProgressionDescriptor = {
  name: string;
  artist?: string;
  section?: string;
  key: NoteType;
  mode: Mode;
  videoId: string;
  chords: {
    seconds: number;
    chord: RomanNumeral;
  }[];
  endSeconds: number;
};

export const emptyProgressionDescriptor: ProgressionDescriptor = {
  name: "Girlfriend",
  artist: "Avril Lavigne",
  key: "D",
  mode: 1,
  videoId: "Bg59q4puhmg",
  chords: [
    {
      seconds: 36.39,
      chord: "I",
    },
    {
      seconds: 39.34,
      chord: "V",
    },
    {
      seconds: 42.23,
      chord: "vi",
    },
    {
      seconds: 45.14,
      chord: "IV",
    },
  ],
  endSeconds: 48.1,
};
