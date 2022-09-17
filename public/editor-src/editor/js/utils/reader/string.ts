import { Reader } from "./types";

export const read: Reader<string> = (v) => {
  switch (typeof v) {
    case "string":
      return v;
    case "number":
      return isNaN(v) ? undefined : v.toString();
    default:
      return undefined;
  }
};

export const is = (s: unknown): s is string => {
  return typeof s === "string";
};
