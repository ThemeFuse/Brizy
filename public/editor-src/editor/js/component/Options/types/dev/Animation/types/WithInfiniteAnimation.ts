export interface WithInfiniteAnimation<I> {
  infiniteAnimation: I;
}

export const setInfiniteAnimation = <M extends WithInfiniteAnimation<T>, T>(
  value: M
): M => ({ ...value, infiniteAnimation: !value.infiniteAnimation });
