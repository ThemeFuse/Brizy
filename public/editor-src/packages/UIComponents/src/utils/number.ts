import { Reader } from "./types/Type";

export const read: Reader<number> = (v) => {
  if (v === "" || (typeof v !== "number" && typeof v !== "string")) {
    return undefined;
  }

  const n = Number(v);

  return isNaN(n) ? undefined : n;
};
