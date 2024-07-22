export interface WithDirection<D> {
  direction: D;
}

export interface WithStyle<D> {
  style: D;
}

export const setStyle = <M extends WithStyle<T>, T>(style: T, m: M): M => ({
  ...m,
  style
});

export const setDirection = <M extends WithDirection<T>, T>(
  direction: T,
  m: M
): M => ({ ...m, direction });
