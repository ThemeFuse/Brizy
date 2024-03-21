export interface WithDuration<D> {
  duration: D;
}

export const setDuration = <M extends WithDuration<T>, T>(
  duration: T,
  m: M
): M => ({ ...m, duration });
