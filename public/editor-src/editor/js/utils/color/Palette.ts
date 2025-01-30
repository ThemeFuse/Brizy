import { PaletteType } from "visual/types/Style";
import { mPipe, pass } from "visual/utils/fp";

export const COLOR3 = "color3";

export const palettes: PaletteType[] = [
  "color1",
  "color2",
  "color3",
  "color4",
  "color5",
  "color6",
  "color7",
  "color8"
];

export const is = (v: string): v is PaletteType =>
  palettes.includes(v as PaletteType);

export const fromString = mPipe(pass(is));
