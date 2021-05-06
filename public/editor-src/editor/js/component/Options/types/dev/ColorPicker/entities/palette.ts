import * as P from "visual/utils/color/Palette";
import { Append, Concat } from "visual/utils/types/Monoid";

export type Palette = "" | P.Palette;

export const palettes: Palette[] = ["", ...P.palettes];

export const empty: Palette = "";

export const fromString = (s: string): Palette | undefined =>
  s === empty ? "" : P.fromString(s);

export const append: Append<Palette> = (a, b) => (a === empty ? b : a);

export const concat: Concat<Palette> = as => as.reduce(append, empty);
