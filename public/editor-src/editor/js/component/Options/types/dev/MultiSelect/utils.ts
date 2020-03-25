import { String } from "visual/utils/string/specs";
import { GetModel } from "visual/component/Options/Type";
import { Value, read } from "./Value";

type ToPromise<T, S> = (v?: S) => Promise<T>;
export type OrPromise<T, S> = T | ToPromise<T, S>;

export function apply<T, R, S>(
  f: (t: T) => R,
  t: OrPromise<T, S>
): OrPromise<R, S> {
  if (typeof t === "function") {
    return (s?: S): Promise<R> => (t as ToPromise<T, S>)(s).then(f);
  } else {
    return f(t);
  }
}

export const getModel: GetModel<Value[]> = get => {
  let value: Value[];
  try {
    value = JSON.parse(String.read(get("value")) ?? "");
  } catch (e) {
    value = [];
  }

  if (!Array.isArray(value) || !value.length) {
    return [];
  }

  return value.reduce((acc: Value[], i) => {
    const value = read(i);

    if (value) {
      acc.push(value);
    }

    return acc;
  }, []);
};
