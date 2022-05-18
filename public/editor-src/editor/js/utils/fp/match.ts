// region 1 argument
export function match<T extends U, A extends T, R, U = A>(...args: [[(t: T) => t is A, (a: A) => R]]): (t: T) => R;
// endregion

// region 2 arguments
export function match<T extends U, A extends T, B extends T, R1, R2, U = A | B>(
  ...args: [[(t: T) => t is A, (a: A) => R1], [(t: T) => t is B, (a: B) => R2]]
): (t: T) => R1 | R2;
// endregion

// region 3 arguments
export function match<T extends U, A extends T, B extends T, C extends T, R1, R2, R3, U = A | B | C>(
  ...args: [[(t: T) => t is A, (a: A) => R1], [(t: T) => t is B, (a: B) => R2], [(t: T) => t is C, (a: C) => R3]]
): (t: T) => R1 | R2 | R3;
// endregion

// region 4 arguments
export function match<
  T extends U,
  A extends T,
  B extends T,
  C extends T,
  D extends T,
  R1,
  R2,
  R3,
  R4,
  U = A | B | C | D
>(
  ...args: [
    [(t: T) => t is A, (a: A) => R1],
    [(t: T) => t is B, (a: B) => R2],
    [(t: T) => t is C, (a: C) => R3],
    [(t: T) => t is D, (a: D) => R4],
  ]
): (t: T) => R1 | R2 | R3 | R4;
// endregion

// region 5 arguments
export function match<
  T extends U,
  A extends T,
  B extends T,
  C extends T,
  D extends T,
  E extends T,
  R1,
  R2,
  R3,
  R4,
  R5,
  U = A | B | C | D | E
>(
  ...args: [
    [(t: T) => t is A, (a: A) => R1],
    [(t: T) => t is B, (a: B) => R2],
    [(t: T) => t is C, (a: C) => R3],
    [(t: T) => t is D, (a: D) => R4],
    [(t: T) => t is E, (a: E) => R5],
  ]
): (t: T) => R1 | R2 | R3 | R4 | R5;
// endregion

// region 6 arguments
export function match<
  T extends U,
  A extends T,
  B extends T,
  C extends T,
  D extends T,
  E extends T,
  F extends T,
  R1,
  R2,
  R3,
  R4,
  R5,
  R6,
  U = A | B | C | D | E | F
>(
  ...args: [
    [(t: T) => t is A, (a: A) => R1],
    [(t: T) => t is B, (a: B) => R2],
    [(t: T) => t is C, (a: C) => R3],
    [(t: T) => t is D, (a: D) => R4],
    [(t: T) => t is E, (a: E) => R5],
    [(t: T) => t is F, (a: F) => R6],
  ]
): (t: T) => R1 | R2 | R3 | R4 | R5 | R6;
// endregion

// region 7 arguments
export function match<
  T extends U,
  A extends T,
  B extends T,
  C extends T,
  D extends T,
  E extends T,
  F extends T,
  G extends T,
  R1,
  R2,
  R3,
  R4,
  R5,
  R6,
  R7,
  U = A | B | C | D | E | F | G
>(
  ...args: [
    [(t: T) => t is A, (a: A) => R1],
    [(t: T) => t is B, (a: B) => R2],
    [(t: T) => t is C, (a: C) => R3],
    [(t: T) => t is D, (a: D) => R4],
    [(t: T) => t is E, (a: E) => R5],
    [(t: T) => t is F, (a: F) => R6],
    [(t: T) => t is G, (a: G) => R7],
  ]
): (t: T) => R1 | R2 | R3 | R4 | R5 | R6 | R7;
// endregion

// region 8 arguments
export function match<
  T extends U,
  A extends T,
  B extends T,
  C extends T,
  D extends T,
  E extends T,
  F extends T,
  G extends T,
  H extends T,
  R1,
  R2,
  R3,
  R4,
  R5,
  R6,
  R7,
  R8,
  U = A | B | C | D | E | F | G | H
>(
  ...args: [
    [(t: T) => t is A, (a: A) => R1],
    [(t: T) => t is B, (a: B) => R2],
    [(t: T) => t is C, (a: C) => R3],
    [(t: T) => t is D, (a: D) => R4],
    [(t: T) => t is E, (a: E) => R5],
    [(t: T) => t is F, (a: F) => R6],
    [(t: T) => t is G, (a: G) => R7],
    [(t: T) => t is H, (a: H) => R8],
  ]
): (t: T) => R1 | R2 | R3 | R4 | R5 | R6 | R7 | R8;
// endregion

export function match<T extends U, A extends T, R, U = A>(
  ...args: Array<[(t: T) => t is A, (a: A) => R]>
): (t: T) => R {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-expect-error
  return (t: T): R => {
    for (let i = 0; i < args.length; i++) {
      if (args[i][0](t)) {
        return args[i][1](t);
      }
    }
  };
}
