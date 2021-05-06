import { Reader } from "./types";

export const read: Reader<string> = v => {
  switch (typeof v) {
    case "string":
      return v;
    case "number":
      return isNaN(v) ? undefined : v.toString();
    default:
      return undefined;
  }
};
