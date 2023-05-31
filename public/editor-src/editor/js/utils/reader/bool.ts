import { Reader } from "./types";

export const read: Reader<boolean> = (v) => {
  if (typeof v === "boolean") {
    return v;
  }
  return undefined;
};
