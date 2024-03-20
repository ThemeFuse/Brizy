import { Eq, IsEqual, eq as defaultEq } from "visual/utils/types/Eq";
import { Monoid } from "visual/utils/types/Monoid";
import { MRead, Reader, ToValue, Type, toValue } from "visual/utils/types/Type";

export const read: Reader<string> = (a) => {
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

export type Empty = "";

export const empty: Empty = "";

export type Auto = "auto";

export const auto: Auto = "auto";

export const isAuto = (s: string): s is Auto => s === auto;

export const append = (a: string, b: string): string => a + b;

export const concat = (as: Array<string>): string => as.join("");

export const eq: IsEqual<string> = defaultEq;

export const mRead: MRead<string> = (v) => read(v) ?? "";

export const String: Type<string> & Monoid<string> & Eq<string> = {
  read,
  empty,
  append,
  concat,
  eq
};
