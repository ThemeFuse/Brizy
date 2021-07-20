import { NewType } from "visual/types/NewType";
import { pass } from "visual/utils/fp";

enum positive {
  positive = "positive"
}

export type Positive = NewType<number, positive.positive>;

export const is = (n: number): n is Positive => n >= 0;

export const fromNumber = pass(is);

export const unsafe = (n: number): Positive => n as Positive;

export const Zero: Positive = 0 as Positive;
