export type NonEmptyArray<A> = [A, ...A[]];

export const isNonEmptyArray = <T>(ts: T[]): ts is NonEmptyArray<T> =>
  !!ts.length;

export type ArrayType<T extends Array<unknown>> = T extends Array<infer P>
  ? P
  : never;
