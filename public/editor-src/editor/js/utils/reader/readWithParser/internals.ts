import { NonEmptyArray } from "visual/utils/array/types";
import {
  DirtyParser,
  PureParser
} from "visual/utils/reader/readWithParser/index";
import { isNullish } from "visual/utils/value";

// region ParseFunction
/**
 * @internal
 */
export type Pure<A, B> = (v: A) => B;

/**
 * @internal
 */
export type Dirty<A, B> = (v: A) => B | undefined;

/**
 * @internal
 */
export type ParseFunction<A, B> = Pure<A, B> | Dirty<A, B>;

/**
 * @internal
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type Simple<P extends ParseFunction<any, any>> = P;

/**
 * @internal
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type Optional<P extends Simple<any>> = {
  __type: "optional";
  fn: P;
};

/**
 * @internal
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type Strict<P extends Simple<any>> = {
  __type: "strict";
  fn: P;
};

/**
 * @internal
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type Def<P extends Simple<any>> = Optional<P> | Strict<P>;

/**
 * @internal
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type All<P extends Simple<any>> = Def<P> | P;
// endregion

// region optional & strict
/**
 * @internal
 */
export const isOptional = <A, B>(
  v: All<ParseFunction<A, B>>
): v is Optional<ParseFunction<A, B>> =>
  (v as Def<ParseFunction<A, B>>).__type === "optional";

/**
 * @internal
 */
export const call = <A, B>(
  p: All<ParseFunction<A, B>>,
  v: A
): B | undefined => {
  switch ((p as Def<ParseFunction<A, B>>).__type) {
    case "optional":
    case "strict":
      return (p as Def<ParseFunction<A, B>>).fn(v);
    default:
      return (p as Simple<ParseFunction<A, B>>)(v);
  }
};
// endregion

// region Parser
/**
 * @internal
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type Parser<A, B extends Record<any, any> | undefined> =
  | PureParser<A, B>
  | DirtyParser<A, B>;

/**
 * @internal
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type ParserSource<P extends Parser<any, any>> = P extends Parser<
  infer T,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  any
>
  ? T
  : never;

/**
 * @internal
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type ParserTarget<P extends Parser<any, any>> = P extends Parser<
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  any,
  infer T
>
  ? T
  : never;
// endregion

// region _parse

/**
 * @internal
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function _parse<P extends PureParser<any, any>>(
  parsers: P,
  object: ParserSource<P>
): ParserTarget<P>;
/**
 * @internal
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function _parse<P extends DirtyParser<any, any>>(
  parsers: P,
  object: ParserSource<P>
): ParserTarget<P> | undefined;
/**
 * @internal
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function _parse<P extends Parser<any, any>>(
  parsers: P,
  object: ParserSource<P>
): ParserTarget<P> | undefined {
  type B = ParserTarget<P>;
  const b: Partial<B> = {};

  for (const p in parsers) {
    if (!Object.prototype.hasOwnProperty.call(parsers, p)) {
      continue;
    }

    const v: B[typeof p] | undefined = call(parsers[p], object);

    if (!isOptional(parsers[p]) && isNullish(v)) {
      return undefined as ParserTarget<P>;
    }

    b[p] = v;
  }

  return b as ParserTarget<P>;
}
// endregion

// region or
/**
 * @internal
 */
export function _or<A, B>(fns: NonEmptyArray<Pure<A, B>>, a: A): B;
/**
 * @internal
 */
export function _or<A, B>(
  fns: NonEmptyArray<ParseFunction<A, B>>,
  object: A
): B | undefined {
  for (let i = 0; i < fns.length; i++) {
    const v = fns[i](object);

    if (!isNullish(v)) {
      return v;
    }
  }

  return undefined;
}
// endregion
