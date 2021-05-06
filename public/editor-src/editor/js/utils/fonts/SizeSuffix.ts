import { pass } from "visual/utils/fp";

export enum SizeSuffix {
  px = "px",
  em = "em",
  rem = "rem",
  vw = "vw"
}

/**
 * Default list of all suffixes
 * @type {string[]}
 */
export const suffixes = Object.values(SizeSuffix);

/**
 *
 * @type {object[]}
 */
export const getSuffixChoices = suffixes.map(x => ({ title: x, value: x }));

/**
 * Default font size suffix value
 *
 * @type {string}
 */
export const empty = SizeSuffix.px;

export const is = (v: string): v is SizeSuffix =>
  suffixes.includes(v as SizeSuffix);

export const fromString = pass(is);
