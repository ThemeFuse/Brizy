import { Reader } from "visual/utils/types/Type";
import { Append, Concat } from "visual/utils/types/Monoid";

export type Type = "none" | "solid" | "gradient";

export const read: Reader<Type> = v =>
  v === "none" || v === "solid" || v === "gradient" ? v : undefined;

export const empty: Type = "none";

export const append: Append<Type> = (a, b) => (a === empty ? b : a);

export const concat: Concat<Type> = as => as.reduce(append, empty);
