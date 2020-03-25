import { Reader, Type } from "visual/utils/types/Type";
import { Append, Concat, Monoid } from "visual/utils/types/Monoid";
import { Eq, IsEqual, eq as defaultEq } from "visual/utils/types/Eq";

// Do not use boolean type alias as this type apparently
// similar to boolean, but in future may appear new constructors
export type Disabled = true | false;

const devices: Disabled[] = [true, false];

export const read: Reader<Disabled> = v => {
  if (typeof v === "boolean") {
    return devices.includes(v as Disabled) ? (v as Disabled) : undefined;
  }

  return undefined;
};

export const empty: Disabled = false;

export const append: Append<Disabled> = (a, b) => (a === empty ? b : a);

export const concat: Concat<Disabled> = as => as.reduce(append, empty);

export const eq: IsEqual<Disabled> = defaultEq;

export const DisabledType: Type<Disabled> & Monoid<Disabled> & Eq<Disabled> = {
  read,
  empty,
  append,
  concat,
  eq
};
