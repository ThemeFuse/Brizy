import { pass } from "fp-utilities";

declare const tag: unique symbol;

export type Speed = -10 | 10 | (number & { [tag]: "speed" });

export const is = (n: number): n is Speed => n >= -10 && n <= 10;

export const fromNumber = pass(is);
