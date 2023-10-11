import { isT } from "fp-utilities";
import { Reader } from "./types";

export const read: Reader<Array<unknown>> = (v) => {
  if (Array.isArray(v)) {
    return v;
  }

  return undefined;
};

export const isAllValuesValid = (arr: Array<unknown>) => arr.every(isT);
