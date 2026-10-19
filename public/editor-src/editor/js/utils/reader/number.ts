import type { Reader } from "./types";

export const read: Reader<number> = (v) => {
  switch (typeof v) {
    case "string": {
      const v_ = v !== "" ? Number(v) : NaN;
      return Number.isNaN(v_) ? undefined : v_;
    }
    case "number":
      return Number.isNaN(v) ? undefined : v;
    default:
      return undefined;
  }
};
