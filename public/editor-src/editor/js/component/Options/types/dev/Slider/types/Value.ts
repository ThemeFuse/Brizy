import { IsEqual } from "visual/utils/types/Eq";

export type Value = {
  number: number;
  unit: string;
};

export const eq: IsEqual<Value> = (a, b) =>
  a.number === b.number && a.unit === b.unit;
