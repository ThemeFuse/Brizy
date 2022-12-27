import { Reader } from "./types";

export const read: Reader<unknown> = v => {
  if (typeof v === "string") {
    try {
      return JSON.parse(v);
    } catch (e) {
      return undefined;
    }
  }

  return undefined;
};
