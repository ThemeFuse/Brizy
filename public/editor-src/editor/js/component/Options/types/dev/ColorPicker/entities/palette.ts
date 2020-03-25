/**
 * @typedef {""|"color1"|"color2"|"color3"|"color4"|"color5"|"color6"|"color7"|"color8"} Palette
 */
import * as P from "visual/utils/color/toPalette";
import * as Value from "visual/utils/value";
import { MRead, Reader } from "visual/utils/types/Type";
import { Append, Concat } from "visual/utils/types/Monoid";
import { MValue } from "visual/utils/value";

export type Palette = "" | P.Palette;

export const palettes: Palette[] = ["", ...P.palettes];

export const read: Reader<Palette> = v =>
  v === "" || P.read(v) ? (v as Palette) : undefined;

export const empty: Palette = "";

export const append: Append<Palette> = (a, b) => (a === empty ? b : a);
export const concat: Concat<Palette> = as => as.reduce(append, empty);

export const mRead: MRead<Palette> = v => read(v) ?? empty;

/**
 * A wrapper for for original `toPalette` function, that consider empty string as a valid palette value.
 *
 * @param {Palette} orElse
 * @param {Palette} v
 * @return {Palette}
 * @deprecated, use read
 */
export const toPalette = (v: unknown, orElse?: Palette): MValue<Palette> =>
  read(v) ?? orElse;

/**
 * @param {Palette} orElse
 * @param {*} v
 * @return {Palette}
 * @deprecated, use mRead in composition with append
 */
export const onEmpty = (v: unknown, orElse?: Palette): MValue<Palette> =>
  Value.onEmpty(empty, mRead(v), orElse);
