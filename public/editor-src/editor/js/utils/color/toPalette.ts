import { Reader } from "visual/utils/types/Type";
import { MValue } from "visual/utils/value";

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

export const read: Reader<Palette> = v =>
  palettes.includes(v as Palette) ? (v as Palette) : undefined;

/**
 * Converts a valid to a valid palette value
 * - If the value is not a valid palette value return orElse
 *
 * @param {string} orElse
 * @param {string} v
 * @returns {string}
 *
 * @deprecated, use read function
 */
export const toPalette = (orElse: Palette, v: unknown): MValue<Palette> =>
  read(v) ?? orElse;
