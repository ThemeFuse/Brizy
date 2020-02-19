import { Reader, Type } from "visual/utils/types/Type";
import { Append, Concat, Monoid } from "visual/utils/types/Monoid";
import { get } from "visual/utils/object/get";
import { String } from "visual/utils/string/specs";
import { Eq, IsEqual } from "visual/utils/types/Eq";

export type Value = {
  population: string;
};

export const read: Reader<Value> = v => {
  if (typeof v === "object") {
    const population = String.read(get("population", v as Value));

    return undefined === population ? undefined : { population };
  }

  if (typeof v === "string") {
    return { population: v };
  }

  return undefined;
};

export const empty: Value = { population: "" };

export const append: Append<Value> = (a, b) => {
  return a.population ? a : b;
};

export const concat: Concat<Value> = as => as.reduce(append, empty);

export const eq: IsEqual<Value> = (a, b) =>
  String.eq(a.population, b.population);

export const ValueType: Type<Value> & Monoid<Value> & Eq<Value> = {
  read,
  empty,
  append,
  concat,
  eq
};
