import { inRange } from "visual/utils/math";
import { Append, Concat } from "visual/utils/types/Monoid";
import { NewType } from "visual/types/NewType";
import { mPipe, pass } from "visual/utils/fp";

enum opacity {
  opacity = "opacity"
}

export type Opacity = NewType<number, opacity.opacity>;

export const is = (v: number): v is Opacity => inRange(0, 1, v);

export const fromNumber = mPipe(pass(is));

export const empty: Opacity = 0 as Opacity;

export const append: Append<Opacity> = (a, b) => (a === empty ? b : a);

export const concat: Concat<Opacity> = as => as.reduce(append, empty);

export const unsafe = (n: number): Opacity => n as Opacity;

export const mRead = null;
