export function styleZIndex({ v }) {
  const { zIndex } = v;

  return zIndex === 0 ? "auto" : zIndex;
}
