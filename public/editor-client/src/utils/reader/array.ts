import { Reader } from "./types";

export const read: Reader<Array<unknown>> = (v) => {
  if (Array.isArray(v)) {
    return v;
  }

  return undefined;
};
