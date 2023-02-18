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
  mode: Mode.Major,
  videoId: "Bg59q4puhmg",
  chords: [
    {
      seconds: 36.56,
      chord: "I",
    },
    {
      seconds: 39.45,
      chord: "V",
    },
    {
      seconds: 42.41,
      chord: "vi",
    },
    {
      seconds: 45.35,
      chord: "IV",
    },
  ],
  endSeconds: 48.25,
};
