import type { Reader, Type } from "visual/utils/types/Type";

export const read: Reader<number> = (v) => {
  if (v === "" || (typeof v !== "number" && typeof v !== "string")) {
    return undefined;
  }

  const n = Number(v);

  return Number.isNaN(n) ? undefined : n;
};

export const NumberSpec: Type<number> = { read };
