export enum Mode {
  Ionian = 1,
  Dorian,
  Phrygian,
  Lydian,
  Mixolydian,
  Aeolian,
  Locrian,
  Major = Ionian,
  Minor = Aeolian,
}

export const modes = [
  {
    label: "Major",
    value: Mode.Ionian,
  },
  {
    label: "Minor",
    value: Mode.Aeolian,
  },
  {
    label: "Dorian",
    value: Mode.Dorian,
  },
  {
    label: "Phrygian",
    value: Mode.Phrygian,
  },
  {
    label: "Lydian",
    value: Mode.Lydian,
  },
  {
    label: "Mixolydian",
    value: Mode.Mixolydian,
  },
  {
    label: "Locrian",
    value: Mode.Locrian,
  },
];
