import { clamp } from "visual/utils/math";

export function formatInputValue(value: number, step: number): string | number {
  const stepDecimalLength = decimalLength(step);

  return stepDecimalLength > 0
    ? value.toFixed(stepDecimalLength)
    : String(value);
}

export function decimalLength(number: number): number {
  const [, decimal] = String(number).split(".");
  return decimal ? decimal.length : 0;
}

export function correctNumber(
  number: number,
  min: number,
  max: number,
  step: number
): number {
  const clampedNumber = clamp(number, min, max);

  if (step === Math.floor(step)) {
    return Math.round(clampedNumber / step) * step;
  }

  return roundByStep(clampedNumber, step, min);
}

export const preciseAdd = preciseOperation.bind(null, "add");

export const preciseSub = preciseOperation.bind(null, "sub");

function roundByStep(number: number, step: number, offset = 0) {
  // this is done to avoid quirks with floating point operations
  // like 1.1 - 1 = 0.10000000000000009
  const mul = 10 ** decimalLength(step);

  number = number * mul;
  step = step * mul;
  offset = offset * mul;

  const tmp = Math.ceil((number - offset) / step) * step + offset;

  return tmp / mul;
}

function preciseOperation(type: "add" | "sub", a: number, b: number) {
  const dla = decimalLength(a);
  const dlb = decimalLength(b);
  const dlMax = Math.max(dla, dlb);
  const mul = 10 ** dlMax;

  const a_ = a * mul;
  const b_ = b * mul;
  let res;

  switch (type) {
    case "add":
      res = a_ + b_;
      break;
    case "sub":
      res = a_ - b_;
      break;
    default:
      throw new Error(`operation type unknown ${type}`);
  }

  return res / mul;
}
