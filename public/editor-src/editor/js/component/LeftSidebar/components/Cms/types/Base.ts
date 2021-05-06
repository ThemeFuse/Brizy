import { isNullish } from "visual/utils/value";

export type Base<T, P> = NoPayload<T> | WithPayload<T, P>;

export type NoPayload<T> = {
  type: T;
};

export type WithPayload<T, P> = {
  type: T;
  payload: P;
};

export const isNoPayload = <T, P>(m: Base<T, P>): m is NoPayload<T> =>
  (m as WithPayload<unknown, unknown>).payload === undefined;

export const isWithPayload = <T, P>(m: Base<T, P>): m is WithPayload<T, P> =>
  (m as WithPayload<unknown, unknown>).payload !== undefined;

export const fromObject = (o: object): Base<unknown, unknown> | undefined => {
  const type = (o as Base<unknown, unknown>).type;
  const payload = (o as WithPayload<unknown, unknown>).payload;

  return isNullish(type) ? undefined : { type, payload };
};
