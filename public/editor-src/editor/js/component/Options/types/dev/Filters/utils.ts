import { Value } from "./types/Value";

// eslint-disable-next-line @typescript-eslint/no-empty-function
export const empty = (): void => {};

export const set = <K extends keyof Value>(k: K, value: Value) => (
  v: Value[K]
): Value => ({ ...value, [k]: v });
