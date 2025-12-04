/**
 * Check if a value T matches one of the provided predicates
 *
 * Used to check current union value
 */
export function isOneOf<T, A extends T>(
  ps: [(v: T) => v is A]
): (v: T) => v is A;
export function isOneOf<T, A extends T, B extends T>(
  ps: [(v: T) => v is A, (v: T) => v is B]
): (v: T) => v is A | B;
export function isOneOf<T, A extends T, B extends T, C extends T>(
  ps: [(v: T) => v is A, (v: T) => v is B, (v: T) => v is C]
): (v: T) => v is A | B | C;
export function isOneOf<T, A extends T, B extends T, C extends T, D extends T>(
  ps: [(v: T) => v is A, (v: T) => v is B, (v: T) => v is C, (v: T) => v is D]
): (v: T) => v is A | B | C | D;
export function isOneOf<
  T,
  A extends T,
  B extends T,
  C extends T,
  D extends T,
  E extends T
>(
  ps: [
    (v: T) => v is A,
    (v: T) => v is B,
    (v: T) => v is C,
    (v: T) => v is D,
    (v: T) => v is E
  ]
): (v: T) => v is A | B | C | D | E;
export function isOneOf<
  T,
  A extends T,
  B extends T,
  C extends T,
  D extends T,
  E extends T,
  F extends T
>(
  ps: [
    (v: T) => v is A,
    (v: T) => v is B,
    (v: T) => v is C,
    (v: T) => v is D,
    (v: T) => v is E,
    (v: T) => v is F
  ]
): (v: T) => v is A | B | C | D | E | F;
export function isOneOf<
  T,
  A extends T,
  B extends T,
  C extends T,
  D extends T,
  E extends T,
  F extends T,
  G extends T
>(
  ps: [
    (v: T) => v is A,
    (v: T) => v is B,
    (v: T) => v is C,
    (v: T) => v is D,
    (v: T) => v is E,
    (v: T) => v is F,
    (v: T) => v is G
  ]
): (v: T) => v is A | B | C | D | E | F | G;
export function isOneOf<
  T,
  A extends T,
  B extends T,
  C extends T,
  D extends T,
  E extends T,
  F extends T,
  G extends T,
  H extends T
>(
  ps: [
    (v: T) => v is A,
    (v: T) => v is B,
    (v: T) => v is C,
    (v: T) => v is D,
    (v: T) => v is E,
    (v: T) => v is F,
    (v: T) => v is G,
    (v: T) => v is H
  ]
): (v: T) => v is A | B | C | D | E | F | G | H;
export function isOneOf<T>(ps: Array<(v: T) => boolean>): (v: T) => boolean;
export function isOneOf<T>(ps: Array<(v: T) => boolean>): (v: T) => boolean {
  return (v: T) => ps.some((p) => p(v));
}
