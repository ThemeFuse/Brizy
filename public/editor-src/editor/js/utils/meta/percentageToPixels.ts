export function percentageToPixels(
  value: number,
  suffix: string,
  containerWidth: number
): number {
  return suffix === "%" ? containerWidth * (value / 100) : value;
}
