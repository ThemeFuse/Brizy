import { Dictionary } from "visual/types/utils";
import { Reader } from "./types";

type ObjWithUnknowns<K extends string> = {
  [k in K]: unknown;
};

export const isObject = (v: unknown): v is Record<string, unknown> =>
  typeof v === "object" && v !== null;

export const hasKey = <T extends string>(
  key: T,
  obj: Record<string, unknown>
): obj is ObjWithUnknowns<T> => key in obj;

export const hasKeys = <T extends string>(
  keys: T[],
  obj: Record<string, unknown>
): obj is ObjWithUnknowns<T> => keys.every((k) => hasKey(k, obj));

export const read: Reader<Record<string, unknown>> = (v) => {
  if (isObject(v)) {
    return v;
  }

  return undefined;
};

export const readAsUnknownDict: Reader<Dictionary<unknown>> = (v) => {
  if (isObject(v)) {
    return v as Dictionary<unknown>;
  }

  return undefined;
};

export const readWithValueReader =
  <T>(
    valueReader: Reader<T>
    // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  ): Reader<Dictionary<T>> =>
  (v) => {
    const obj = readAsUnknownDict(v);

    if (obj !== undefined) {
      const r: Dictionary<T> = {};

      for (const [k, v] of Object.entries(obj)) {
        const vParsed = valueReader(v);

        if (vParsed !== undefined) {
          r[k] = vParsed;
        } else {
          return undefined;
        }
      }

      return r;
    }

    return undefined;
  };

export const readKey =
  (key: string) =>
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (obj: Record<string, any>): unknown =>
    hasKey(key, obj) ? obj[key] : undefined;

export const length = (obj: Record<string, unknown>): number =>
  Object.keys(obj).length;
