export const noteTypes = [
  "C",
  "F",
  "A#",
  "Bb",
  "D#",
  "Eb",
  "G#",
  "Ab",
  "C#",
  "Db",
  "F#",
  "Gb",
  "B",
  "E",
  "A",
  "D",
  "G",
] as const;

export type NoteType = (typeof noteTypes)[number];
