import { Append, Concat } from "visual/utils/types/Monoid";
import { Reader } from "visual/utils/types/Type";

export type Type = "none" | "solid" | "gradient" | "animated-gradient";

const Types: Type[] = ["none", "solid", "gradient", "animated-gradient"];

export const read: Reader<Type> = (v) =>
  Types.includes(v as Type) ? (v as Type) : undefined;

export const empty: Type = "none";

export const append: Append<Type> = (a, b) => (a === empty ? b : a);

export const concat: Concat<Type> = (as) => as.reduce(append, empty);
