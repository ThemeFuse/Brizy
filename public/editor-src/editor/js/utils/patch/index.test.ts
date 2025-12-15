import { Getter } from "visual/utils/model";
import { Patcher, apply, filterPatchValues, patcher } from "./index";

/**
 * Testing patch function behavior
 */
// eslint-disable-next-line jest/no-export
export const testPatchFunction = <V, M extends P, P>(
  patch: Patcher<V, M, P>,
  getter: Getter<V, M>,
  valid: V[],
  m: M
) => {
  describe("Testing patch function behaviour", function () {
    test("If value is equal to current value, return undefined", () => {
      valid.forEach((v) => {
        const p = patch(v, m);
        if (p) {
          expect(patch(v, { ...m, ...p })).toEqual(undefined);
        }
      });
    });

    test("If value is valid, return object containing the value", () => {
      valid.forEach((v) => {
        const p = patch(v, m);
        if (p) {
          expect(getter({ ...m, ...p })).toBe(v);
        }
      });
    });
  });
};

describe("Testing 'patcher' function", function () {
  type M = { test: string };

  const m: M = { test: "" };
  const valid = ["test1", "test2", "test3"];
  const getter = (m: M): string => m.test;
  const fn = (v: string): M => ({ test: v });
  const patch = patcher(getter, fn);

  testPatchFunction(patch, getter, valid, m);

  test("Return same object as the original patch function would return", () => {
    valid.forEach((v) => expect(patch(v, m)).toEqual(fn(v)));
  });
});

describe("Testing 'apply' function", function () {
  type P1 = { test1: number };
  type P2 = { test2: number };
  type M = { test1: number; test2: number };

  const m: M = { test1: 0, test2: 0 };

  const patch1 = (v: number): P1 => ({ test1: v });
  const patch2 = (v: number): P2 => ({ test2: v });

  test("Function returns an object with values of multiple patches", () => {
    const result: M = { test1: 1, test2: 2 };

    expect(
      apply<number, number, P1, P2, M>(
        [
          [patch1, 1],
          [patch2, 2]
        ],
        m
      )
    ).toEqual(result);
  });

  test("The returned object, contains only values added by patches", () => {
    const result: M = { test1: 1, test2: 2 };

    expect(
      apply(
        [
          [patch1, 1],
          [patch2, 2]
        ],
        { ...m, test3: 3 }
      )
    ).toEqual(result);
  });
});

describe("Testing 'filterPatchValues' function", function () {
  test("should return null for non-object inputs", () => {
    expect(filterPatchValues(null)).toBe(null);
    expect(filterPatchValues(undefined)).toBe(null);
    expect(filterPatchValues("string")).toBe(null);
    expect(filterPatchValues(123)).toBe(null);
    expect(filterPatchValues(true)).toBe(null);
    expect(filterPatchValues(false)).toBe(null);
    expect(filterPatchValues([])).toBe(null);
    expect(filterPatchValues([1, 2, 3])).toBe(null);
    expect(filterPatchValues(() => {})).toBe(null);
    expect(filterPatchValues(Symbol("test"))).toBe(null);
  });

  test("should return empty object for empty object input", () => {
    expect(filterPatchValues({})).toEqual({});
  });

  test("should filter and return only string, number, and boolean values", () => {
    const input = {
      stringValue: "hello",
      numberValue: 42,
      booleanValue: true,
      nullValue: null,
      undefinedValue: undefined,
      arrayValue: [1, 2, 3],
      objectValue: { nested: "value" },
      functionValue: () => {},
      symbolValue: Symbol("test")
    };

    const expected = {
      stringValue: "hello",
      numberValue: 42,
      booleanValue: true
    };

    expect(filterPatchValues(input)).toEqual(expected);
  });

  test("should handle mixed valid and invalid values", () => {
    const input = {
      validString: "test",
      validNumber: 0,
      validBoolean: false,
      invalidNull: null,
      invalidArray: [],
      invalidObject: {},
      validNegativeNumber: -5,
      validFloat: 3.14,
      validEmptyString: ""
    };

    const expected = {
      validString: "test",
      validNumber: 0,
      validBoolean: false,
      validNegativeNumber: -5,
      validFloat: 3.14,
      validEmptyString: ""
    };

    expect(filterPatchValues(input)).toEqual(expected);
  });

  test("should handle edge cases for valid types", () => {
    const input = {
      zero: 0,
      negativeZero: -0,
      infinity: Infinity,
      negativeInfinity: -Infinity,
      nan: NaN,
      emptyString: "",
      whitespaceString: "   ",
      trueValue: true,
      falseValue: false
    };

    const expected = {
      zero: 0,
      negativeZero: -0,
      infinity: Infinity,
      negativeInfinity: -Infinity,
      nan: NaN,
      emptyString: "",
      whitespaceString: "   ",
      trueValue: true,
      falseValue: false
    };

    expect(filterPatchValues(input)).toEqual(expected);
  });

  test("should preserve object structure and key names", () => {
    const input = {
      camelCase: "value1",
      snake_case: "value2",
      "kebab-case": "value3",
      "with spaces": "value4",
      with123numbers: "value5",
      "special!@#$%chars": "value6"
    };

    const expected = {
      camelCase: "value1",
      snake_case: "value2",
      "kebab-case": "value3",
      "with spaces": "value4",
      with123numbers: "value5",
      "special!@#$%chars": "value6"
    };

    expect(filterPatchValues(input)).toEqual(expected);
  });

  test("should handle objects with only invalid values", () => {
    const input = {
      nullValue: null,
      undefinedValue: undefined,
      arrayValue: [1, 2, 3],
      objectValue: { nested: "value" },
      functionValue: () => {}
    };

    expect(filterPatchValues(input)).toEqual({});
  });

  test("should handle objects with only valid values", () => {
    const input = {
      string1: "hello",
      string2: "world",
      number1: 1,
      number2: 2.5,
      boolean1: true,
      boolean2: false
    };

    expect(filterPatchValues(input)).toEqual(input);
  });

  test("should not mutate the original object", () => {
    const input = {
      valid: "test",
      invalid: null,
      array: [1, 2, 3]
    };
    const originalInput = { ...input };

    filterPatchValues(input);

    expect(input).toEqual(originalInput);
  });

  test("should handle objects with prototype properties", () => {
    const input = Object.create({ inherited: "value" });
    input.ownString = "own";
    input.ownNumber = 42;
    input.ownBoolean = true;

    const expected = {
      ownString: "own",
      ownNumber: 42,
      ownBoolean: true
    };

    expect(filterPatchValues(input)).toEqual(expected);
  });
});
