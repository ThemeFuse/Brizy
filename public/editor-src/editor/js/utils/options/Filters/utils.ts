import { Value } from "visual/component/Options/types/dev/Filters/types/Value";

export const MAX = 200;

// eslint-disable-next-line @typescript-eslint/no-empty-function
export const empty = (): void => {};

export const set =
  <K extends keyof Value>(k: K, value: Value) =>
  (v: Value[K]): Value => ({ ...value, [k]: v });
