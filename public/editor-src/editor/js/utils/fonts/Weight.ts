import { pass } from "visual/utils/fp";
import * as Positive from "visual/utils/math/Positive";

export enum Weight {
  THIN = 100,
  EXTRA_LIGHT = 200,
  LIGHT = 300,
  NORMAL = 400,
  MEDIUM = 500,
  SEMI_BOLD = 600,
  BOLD = 700,
  EXTRA_BOLD = 800,
  BLACK = 900
}

export const weights = Object.values(Weight).filter((v): v is Weight =>
  Positive.is(Number(v))
);
/**
 * Default font weight value
 *
 * @type {number}
 */
export const empty = Weight.NORMAL;

export const is = (v: number): v is Weight => weights.includes(v);

export const fromNumber = pass(is);
