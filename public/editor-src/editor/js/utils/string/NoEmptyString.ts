import { pass } from "fp-utilities";
import { NewType } from "visual/types/NewType";

enum type {}

export type NoEmptyString = NewType<string, type>;

export const is = (s: string): s is NoEmptyString => !!s.length;

export const fromString = pass(is);
