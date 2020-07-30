import { Reader } from "visual/utils/types/Type";
import * as N from "visual/utils/math/number";

export type Value = {
  x: number;
  y: number;
};

export const read: Reader<Value> = v => {
  if (typeof v !== "object") {
    return undefined;
  }

  const x = N.read((v as Value).x);
  const y = N.read((v as Value).y);

  if (x !== undefined && y !== undefined) {
    return { x, y };
  }

  return undefined;
};
