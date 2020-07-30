import { MRead, Reader, toValue, ToValue, Type } from "visual/utils/types/Type";
import { Monoid } from "visual/utils/types/Monoid";
import { Eq, IsEqual, eq as defaultEq } from "visual/utils/types/Eq";

export const read: Reader<string> = a => {
  switch (typeof a) {
    case "string":
      return a;
    case "number":
      return a.toString();
    default:
      return undefined;
  }
};

export const toString: ToValue<string> = toValue(read);

export const empty = "";

export const append = (a: string, b: string): string => a + b;

export const concat = (as: Array<string>): string => as.join("");

export const eq: IsEqual<string> = defaultEq;

export const mRead: MRead<string> = v => read(v) ?? "";

export const String: Type<string> & Monoid<string> & Eq<string> = {
  read,
  empty,
  append,
  concat,
  eq
};
