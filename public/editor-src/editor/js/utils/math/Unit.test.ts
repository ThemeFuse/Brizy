import { is, fromNumber, Min, Max, unsafe } from "./Unit";

const valid = [-0, 0, 0.1, 0.56, 1];
const invalid = [-1, -0.56, 1.3, 45];

describe("Testing 'is' function", () => {
  test("Value should be >=0 and <= 1", () => {
    valid.forEach(v => expect(is(v)).toBe(true));
    invalid.forEach(v => expect(is(v)).toBe(false));
  });
});

describe("Testing 'fromNumber' function", () => {
  test("If `is return true, return value, otherwise, return undefined`", () => {
    [...valid, ...invalid].forEach(v =>
      expect(fromNumber(v)).toBe(is(v) ? v : undefined)
    );
  });
});

describe("Testing 'unsafe' function", () => {
  test("It should return back the provided value", () => {
    [-1, 0, 0.5, 1, 45].forEach(v => expect(unsafe(v)).toBe(v));
  });
});

describe("Test Min and Max", () => {
  test("Min should be 0", () => expect(Min).toBe(0));
  test("Max should be 1", () => expect(Max).toBe(1));
});
