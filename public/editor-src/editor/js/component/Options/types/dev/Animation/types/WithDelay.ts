export interface WithDelay<D> {
  delay: D;
}

export const setDelay = <M extends WithDelay<T>, T>(delay: T, m: M): M => ({
  ...m,
  delay
});
