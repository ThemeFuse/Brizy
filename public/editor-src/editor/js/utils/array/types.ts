export interface NonEmptyArray<A> extends Array<A> {
  0: A;
}

export type ArrayType<T extends Array<unknown>> = T extends Array<infer P>
  ? P
  : never;
