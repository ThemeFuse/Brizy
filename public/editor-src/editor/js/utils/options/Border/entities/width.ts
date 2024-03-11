import { Append, Concat } from "visual/utils/types/Monoid";
import { NewType } from "visual/types/NewType";
import { pass } from "visual/utils/fp";

enum borderWidth {
  borderWidth = "borderWidth"
}

export type Width = NewType<number, borderWidth.borderWidth>;

export const is = (n: number): n is Width => n >= 0;

export const fromNumber = pass(is);

/**
 * Represents board style empty value
 * @type {number}
 */
export const empty: Width = 0 as Width;

export const append: Append<Width> = (a, b) => (a === empty ? b : a);

export const concat: Concat<Width> = as => as.reduce(append, empty);

export const unsafe = (n: number): Width => n as Width;
