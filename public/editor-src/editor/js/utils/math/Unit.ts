import { NewType } from "visual/types/NewType";
import { pass } from "visual/utils/fp";

enum positive {
  positive = "unit"
}

export type Unit = 0 | 1 | NewType<number, positive.positive>;

/**
 * Check if number value is a Unit
 */
export const is = (n: number): n is Unit => n >= 0 && n <= 1;

export const fromNumber = pass(is);

/**
 * Construct Unit value unsafely
 *
 * The responsibility is on the dev that uses this function
 */
export const unsafe = (n: number): Unit => n as Unit;

export const Min: Unit = 0 as Unit;

export const Max: Unit = 1 as Unit;
