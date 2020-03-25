export type IsEqual<T> = (a: T, b: T) => boolean;

export type Eq<T> = { eq: IsEqual<T> };

export function eq<T>(a: T, b: T): boolean {
  return a === b;
}
