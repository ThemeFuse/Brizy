import { isNullish } from "../value";
import { Reader } from "./types";

export const read: Reader<Array<unknown>> = v => {
  if (Array.isArray(v)) {
    return v;
  }

  return undefined;
};

export const readWithItemReader = <T>(
  itemReader: Reader<T>
  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
): Reader<Array<T>> => v => {
  if (Array.isArray(v)) {
    const tmp = (v as Array<unknown>).map(itemReader);
    return tmp.some(item => isNullish(item)) ? undefined : (tmp as Array<T>);
  }

  return undefined;
};
