import { IsEqual } from "visual/utils/types/Eq";

export type Value = {
  from: number;
  to: number;
};

export const eq: IsEqual<Value> = (a, b) => a.from === b.from && a.to === b.to;
