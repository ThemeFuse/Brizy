import { NewType } from "visual/types/NewType";
import { mPipe, pass } from "visual/utils/fp";
import { Append } from "visual/utils/types/Monoid";

enum spread {
  spread = "spread"
}

export type Spread = NewType<number, spread.spread>;

export const is = (n: number): n is Spread => n >= 0;

export const fromNumber = mPipe(pass(is));

export const unsafe = (n: number): Spread => n as Spread;

export const empty: Spread = 0 as Spread;

export const append: Append<Spread> = (a, b) => a || b;
