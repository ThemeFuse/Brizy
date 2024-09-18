import { Reader } from "./types";

export const readOnlyString: Reader<string> = (a) => {
  switch (typeof a) {
    case "string":
      return a;
    case "number":
      return undefined;
    default:
      return undefined;
  }
};
