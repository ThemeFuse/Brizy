import { mPipe, pass } from "visual/utils/fp";

export type Palette =
  | "color1"
  | "color2"
  | "color3"
  | "color4"
  | "color5"
  | "color6"
  | "color7"
  | "color8";

export const COLOR3 = "color3";

export const palettes: Palette[] = [
  "color1",
  "color2",
  "color3",
  "color4",
  "color5",
  "color6",
  "color7",
  "color8"
];

export const is = (v: string): v is Palette => palettes.includes(v as Palette);

export const fromString = mPipe(pass(is));
