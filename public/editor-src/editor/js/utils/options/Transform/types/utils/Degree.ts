import { pass } from "fp-utilities";

declare const tag: unique symbol;

export type Degree = -359 | 0 | 359 | (number & { [tag]: "degree" });

export const is = (n: number): n is Degree => n >= -359 && n <= 359;

export const fromNumber = pass(is);
