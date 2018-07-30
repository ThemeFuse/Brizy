export function percentageToPixels(value, suffix, containerWidth) {
  return suffix === "%" ? containerWidth * (value / 100) : value;
}
