import { IsEqual } from "visual/utils/types/Eq";

export type Value = {
  value: number;
  unit: string;
};

export const eq: IsEqual<Value> = (a, b) =>
  a.value === b.value && a.unit === b.unit;
