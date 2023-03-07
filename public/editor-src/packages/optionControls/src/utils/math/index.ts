export function clamp(number: number, min: number, max: number): number {
  if (number < min) {
    return min;
  }

  if (number > max) {
    return max;
  }

  return number;
}
