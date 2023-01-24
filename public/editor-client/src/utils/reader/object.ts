import { ObjWithUnknowns, Reader } from "./types";

export const isObject = (v: unknown): v is Record<string, unknown> =>
  typeof v === "object" && v !== null;

export const hasKey = <T extends string>(
  key: T,
  obj: Record<string, unknown>
): obj is ObjWithUnknowns<T> => key in obj;

export const readKey =
  (key: string) =>
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (obj: Record<string, any>): unknown =>
    hasKey(key, obj) ? obj[key] : undefined;

export const read: Reader<Record<string, unknown>> = (v) => {
  if (isObject(v)) {
    return v;
  }

  return undefined;
};
