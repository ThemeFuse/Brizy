export { pipe } from "./pipe";
export { mPipe } from "./mPipe";

export function pass<A, B extends A>(
  predicate: (a: A) => a is B
): (t: A) => B | undefined;
export function pass<A>(predicate: (a: A) => boolean): (t: A) => A | undefined;
export function pass<A>(predicate: (a: A) => boolean) {
  return (t: A): A | undefined => (predicate(t) ? t : undefined);
}
