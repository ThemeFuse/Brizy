import { NonEmptyArray } from "visual/utils/array/types";
import {
  Optional,
  Pure,
  Simple,
  Def,
  Dirty,
  ParserSource,
  ParseFunction,
  Strict,
  _parse,
  _or
} from "./internals";

// region Parser
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type PureParser<A, B extends Record<any, any> | undefined> = {
  [K in keyof B]: unknown extends B[K]
    ? Pure<A, B[K]>
    : undefined extends B[K]
    ? Optional<Pure<A, B[K]>>
    : Pure<A, B[K]>;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type DirtyParser<A, B extends Record<any, any> | undefined> = {
  [K in keyof B]: unknown extends B[K]
    ? Simple<Dirty<A, B[K]>>
    : undefined extends B[K]
    ? Def<Dirty<A, B[K]>>
    : Dirty<A, B[K]>;
};
// endregion

// region optional & strict
/**
 * Even if the parser returns `undefined`, the parsing process will not be stopped.
 * It's used to parse for types with optional keys
 */
export const optional = <A, B>(
  p: Simple<ParseFunction<A, B>>
): Optional<ParseFunction<A, B>> => ({
  __type: "optional",
  fn: p
});

/**
 * The `parse` function forces you to explicitly tell what type of parser will be used for optional keys
 * Usually it will be the `optional` type, but there are moment when even if the key is optional, to parse it strictly
 * and if it is missing, to stop the parser.
 *
 * Functionally it is equivalent to Simple parser.
 */
export const strict = <A, B>(
  p: Simple<ParseFunction<A, B>>
): Strict<ParseFunction<A, B>> => ({
  __type: "strict",
  fn: p
});
// endregion

// region readWithParser
/**
 * Parse for a object structure from an type A. Need to provide a parser function for each object key.
 * If any of the parsers will return undefined, the parsing process will be stopped and will return `undefined`
 *
 * !Important: If the key is optional, you are forced to tell explicitly if the parser is strict or optional.
 *  - optional - even if this parser will return undefined, the parsing process will not be stopped, as the key is
 *  optional by specs and it is allowed to be undefined.
 *  - strict - even if the key is optional, user may want to stop parsing if current parser will return undefined
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function readWithParser<A, B extends Record<any, any> | undefined>(
  parsers: DirtyParser<A, B>
): (object: A) => B | undefined;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function readWithParser<A, B extends Record<any, any> | undefined>(
  parsers: DirtyParser<A, B>,
  object: A
): B | undefined;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function readWithParser<A, B extends Record<any, any> | undefined>(
  parsers: DirtyParser<A, B>,
  object?: A
): ((object: A) => B | undefined) | B | undefined {
  return object === undefined
    ? (o: A): B | undefined =>
        _parse<DirtyParser<A, B>>(parsers, o as ParserSource<DirtyParser<A, B>>)
    : _parse<DirtyParser<A, B>>(
        parsers,
        object as ParserSource<DirtyParser<A, B>>
      );
}
// endregion

// region parseStrict
/**
 * Parse for a object structure from an type A. Need to provide a parser function for each object key.
 * If any of the parsers will return undefined, the parsing process will be stopped and will return `undefined`
 *
 * !Important: If the key is optional, you are forced to tell explicitly if the parser is strict or optional.
 *  - optional - even if this parser will return undefined, the parsing process will not be stopped, as the key is
 *  optional by specs and it is allowed to be undefined.
 *  - strict - even if the key is optional, user may want to stop parsing if current parser will return undefined
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function parseStrict<A, B extends Record<any, any> | undefined>(
  parsers: PureParser<A, B>
): (object: A) => B;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function parseStrict<A, B extends Record<any, any> | undefined>(
  parsers: PureParser<A, B>,
  object: A
): B;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function parseStrict<A, B extends Record<any, any> | undefined>(
  parsers: PureParser<A, B>,
  object?: A
): ((object: A) => B) | B {
  return object === undefined
    ? (o: A): B =>
        _parse<PureParser<A, B>>(parsers, o as ParserSource<PureParser<A, B>>)
    : _parse<PureParser<A, B>>(
        parsers,
        object as ParserSource<PureParser<A, B>>
      );
}
// endregion

// region or
/**
 * Combine multiple parsers for the same value in one.
 * Apply each parse one by one until first successful parse, or return undefined
 *
 * This function is useful if you have multiple parsing methods for the same value,
 * Also it is good when parsing union types.
 *
 * !Note 1: The parser wit highest priority should be placed first in stack,
 * as the function applies parsers from left to right. Also in case the
 * data source may have ambiguous structure that satisfies 2 or more parsers
 * from stack, always the first successful parser will be used.
 *
 * !Note 2: For performance reasons, you can place the most lightweight parsers
 * in front of the stack, but make sure this does not conflict with Note 1
 *
 * Check out tests for examples
 */
export function or<A, B>(...args: [NonEmptyArray<Pure<A, B>>]): (v: A) => B;
export function or<A, B>(...args: [NonEmptyArray<Pure<A, B>>, A]): B;
export function or<A, B>(
  ...args: [NonEmptyArray<Pure<A, B>>] | [NonEmptyArray<Pure<A, B>>, A]
): ((v: A) => B) | B;
export function or<A, B>(
  ...args: [NonEmptyArray<ParseFunction<A, B>>]
): (v: A) => B | undefined;
export function or<A, B>(
  ...args: [NonEmptyArray<ParseFunction<A, B>>, A]
): B | undefined;
export function or<A, B>(
  ...args:
    | [NonEmptyArray<ParseFunction<A, B>>]
    | [NonEmptyArray<ParseFunction<A, B>>, A]
): ((v: A) => B | undefined) | B | undefined {
  return args.length === 1
    ? (a: A): B | undefined => _or(args[0], a)
    : _or(args[0], args[1]);
}
// endregion
