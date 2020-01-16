import { hasProps, map, toObject } from "visual/utils/object/index";

describe("Testing 'hasProps' function", () => {
  test("Return 'true' if object has all properties", () => {
    expect(hasProps(["a", "b", "c"], { a: 1, b: 2, c: 3 })).toBe(true);
  });
  test("Return 'false' if object is missing a property", () => {
    expect(hasProps(["a", "b", "c"], { a: 1, c: 3 })).toBe(false);
  });

  test("Handle empty values. Always 'false'", () => {
    [undefined, null].map(v => expect(hasProps(["a", "b"], v)).toBe(false));
  });
});

describe("Testing 'map' function", () => {
  test("If value is array, map over array", () => {
    const f = i => i + 1;
    const value = [1, 2, 3];
    const result = [2, 3, 4];

    expect(map(f, value)).toEqual(result);
  });

  test("If value is an object, map over own keys", () => {
    const f = i => i + 1;
    const value = { a: 1, b: 2, c: 3 };
    const result = { a: 2, b: 3, c: 4 };

    expect(map(f, value)).toEqual(result);
  });

  test("If value is not array or object, do not apply function", () => {
    const f = i => i + 1;

    [1, "test", null, undefined].map(v => expect(map(f, v)).toBe(v));
  });
});

describe("Testing 'toObject' function", function() {
  test("if value is object type, return value", () => {
    const v = {};
    expect(toObject(v)).toBe(v);
  });

  test("if value is not object type, return empty object", () => {
    [undefined, 1, "", () => ({})].map(v => expect(toObject(v)).toEqual({}));
  });

  test("if value is null, return empty object", () => {
    expect(toObject(null)).toEqual({});
  });
});
