import { Palette } from "./palette";

export type Value = {
  hex: string;
  opacity: number;
  tempOpacity: number;
  palette: Palette;
  tempPalette: Palette;
};
