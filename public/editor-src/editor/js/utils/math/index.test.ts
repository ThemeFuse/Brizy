import {
  clamp,
  inRange,
  isNumber,
  roundTo,
  toNumber,
  toPositive,
  toNonNegative
} from "visual/utils/math/index";
import { testToValue } from "visual/utils/value/utilites.test";
import { times } from "underscore";

describe("Testing 'clamp' function", function() {
  test("Return min value if number < min", () => {
    expect(clamp(5, 6, 8)).toBe(6);
  });

  test("Return max value if number > max", () => {
    expect(clamp(10, 6, 8)).toBe(8);
  });

  test("Return number if (number >= min) and (number <= max)", () => {
    expect(clamp(7, 6, 8)).toBe(7);
  });
});

describe("Testing 'roundTo' function", function() {
  test("Cast output to first 2 decimals if the it is longer", () => {
    expect(roundTo(10 / 3, 2)).toBe(3.33);
  });

  test("Do not add 0s if the decimals length is shorter then places", () => {
    expect(roundTo(5 / 2, 3)).toBe(2.5);
  });
});

describe("Testing 'isNumber' function", function() {
  test("Should behavior exactly like 'typeof n === number'", () => {
    [1, 2, -2, 3.3, -5.6, "1", {}, undefined, null].map(v =>
      expect(isNumber(v)).toBe(typeof v === "number")
    );
  });
});

describe("Testing 'inRange' function", function() {
  test("Return false if n is lower then min", () => {
    expect(inRange(1, 5, 0)).toBe(false);
  });
  test("Return false if n is higher then max", () => {
    expect(inRange(1, 2, 5)).toBe(false);
  });
  test("Return true if n is higher then min and lower then max", () => {
    expect(inRange(3, 7, 5)).toBe(true);
  });
});

describe("Testing 'toNumber' function", function() {
  test("Return value if it's type is a number", () => {
    expect(toNumber(2, 1)).toBe(2);
  });

  test("If value is not valid, return orElse value", () => {
    [undefined, null, "", {}, () => ({})].map(v =>
      expect(toNumber(v, -123456)).toBe(-123456)
    );
  });

  test("Numeric strings are not considered numbers", () => {
    expect(toNumber("2", 1)).toBe(1);
  });
});

describe("Testing 'toPositive' function", function() {
  testToValue(toNonNegative, times(100, i => i + 1), [
    undefined,
    null,
    "",
    "0",
    {},
    -1,
    -2
  ]);
});

describe("Testing 'toPositive' function", function() {
  testToValue(toPositive, times(100, i => i + 1), [
    undefined,
    null,
    "",
    "0",
    {},
    0,
    -1,
    -2
  ]);
});
