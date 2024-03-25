import { pass } from "visual/utils/fp";

export type Type = "grouped" | "ungrouped";

export const types = ["grouped", "ungrouped"] as const;

export const is = (s: string): s is Type => types.includes(s as Type);

export const fromString = pass(is);
