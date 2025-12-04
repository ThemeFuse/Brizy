import { produce } from "immer";
import { Dictionary } from "visual/types/utils";
import { isNullish } from "visual/utils/value";
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

export const hasSomeKey = <T extends string>(
  keys: T[],
  obj: Record<string, unknown>
): obj is ObjWithUnknowns<T> => keys.some((k) => hasKey(k, obj));

export const read: Reader<Record<string, unknown>> = (v) => {
  if (isObject(v)) {
    return v;
  }

  return undefined;
};

export const readNoArray: Reader<Record<string, unknown>> = (v) => {
  if (isObject(v) && !Array.isArray(v)) {
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
  <T>(valueReader: Reader<T>): Reader<Dictionary<T>> =>
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

export const isEmpty = (obj: Record<string, unknown>): boolean =>
  length(obj) === 0;

export const filterNullish = <T extends Record<string, unknown>>(
  obj: T,
  options?: { empty?: boolean }
): T =>
  produce(obj, (draft) => {
    Object.keys(draft).forEach((k) => {
      const current = draft[k];

      if (isNullish(current)) {
        delete draft[k];
      }

      if (options?.empty) {
        if (current === "") {
          delete draft[k];
        }

        if (isObject(current)) {
          if (
            (Array.isArray(current) && current.length === 0) ||
            length(current) === 0
          ) {
            delete draft[k];
          }
        }
      }

      if (isObject(current) && !Array.isArray(current) && length(current) > 0) {
        // @ts-expect-error: Index signature
        draft[k] = filterNullish(current);
      }
    });
  });

// get key:value differences between 2 objects
export const diff = <
  T extends Record<string, unknown> = Record<string, unknown>,
  K extends Record<string, unknown> = Record<string, unknown>
>(
  obj1: T,
  obj2: K
): K | Partial<K> => {
  const result = {} as { [k in string]: unknown };

  if (Object.is(obj1, obj2)) {
    return {} as K;
  }
  if (!obj2 || typeof obj2 !== "object") {
    return obj2;
  }

  Object.keys(obj1 || {})
    .concat(Object.keys(obj2 || {}))
    .forEach((key) => {
      if (obj2[key] !== obj1[key] && !Object.is(obj1[key], obj2[key])) {
        result[key] = obj2[key];
      }

      if (isObject(obj2[key]) && isObject(obj1[key])) {
        const value = diff(obj1[key] as T, obj2[key] as K);
        if (value !== undefined) {
          result[key] = value;
        }
      }
    });

  return filterNullish(result) as K | Partial<K>;
};

export const replaceNullish = <
  T extends Record<string, unknown> = Record<string, unknown>
>(
  obj1: T,
  obj2: T
): T => {
  return produce(obj1, (draft) => {
    Object.keys(draft).forEach((k) => {
      const current = draft[k];

      if (isNullish(current)) {
        const candidate = obj2[k];

        if (!isNullish(candidate)) {
          // @ts-expect-error: Index signature
          draft[k] = candidate;
        }
      }
    });
  });
};
