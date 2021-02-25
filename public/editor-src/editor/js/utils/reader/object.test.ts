import { read, isObject, hasKey, hasKeys } from "./object";
import { read as readString } from "./string";
import { read as readNumber } from "./number";

test("Testing 'isObject' function", () => {
  expect(isObject(undefined)).toBe(false);
  expect(isObject(null)).toBe(false);
  expect(isObject(NaN)).toBe(false);
  expect(isObject("")).toBe(false);
  expect(isObject("text")).toBe(false);
  expect(isObject("[4]")).toBe(false);
  expect(isObject("{}")).toBe(false);
  expect(isObject(1)).toBe(false);
  expect(isObject(2.3)).toBe(false);

  expect(isObject({})).toEqual(true);
  expect(isObject({ a: 123, b: "b" })).toEqual(true);
  expect(isObject([])).toEqual(true);
  expect(isObject([1, 2, 3])).toEqual(true);
});

test("Testing 'hasKey' function", () => {
  expect(hasKey("a", {})).toEqual(false);

  expect(hasKey("a", { a: "a" })).toEqual(true);
  expect(hasKey("a", { aa: "aa" })).toEqual(false);
  expect(hasKey("b", { a: "a" })).toEqual(false);

  expect(hasKey("length", [])).toEqual(true);
  expect(hasKey("0", ["a"])).toEqual(true);
  expect(hasKey("0", [])).toEqual(false);
});

test("Testing 'hasKeys' function", () => {
  expect(hasKeys([], {})).toEqual(true);
  expect(hasKeys([], { a: "a" })).toEqual(true);

  expect(hasKeys(["a"], {})).toEqual(false);

  expect(hasKeys(["a"], { a: "a" })).toEqual(true);
  expect(hasKeys(["a", "aa"], { a: "a", aa: "aa" })).toEqual(true);
  expect(hasKeys(["b"], { a: "a" })).toEqual(false);
  expect(hasKeys(["a", "b"], { a: "a", aa: "aa" })).toEqual(false);
});
