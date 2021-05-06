import { pass } from "./index";

describe("Testing 'pass' function", function() {
  const isEven = (n: number): boolean => n % 2 === 0;
  const isObject = (v: unknown): boolean => typeof v === "object";

  describe("If value is does not pass the predicate, return undefined", function() {
    test.each([1, 3, 5, 7, 9])("%d is not an even number", v =>
      expect(pass(isEven)(v)).toBe(undefined)
    );
  });

  describe("If value is passes the predicate, return value", function() {
    test.each([2, 4, 6, 8, 10])("%d is an even number", v =>
      expect(pass(isEven)(v)).toBe(v)
    );
  });

  test("If value is passes the predicate, return the same reference", function() {
    [[], {}, new Map()].map(v => expect(pass(isObject)(v)).toBe(v));
  });
});
