import { read } from "./json";

test("Testing 'read' function", () => {
  expect(read(undefined)).toBe(undefined);
  expect(read(null)).toBe(undefined);
  expect(read({})).toBe(undefined);
  expect(read({ a: "a" })).toBe(undefined);
  expect(read([])).toEqual(undefined);
  expect(read(NaN)).toBe(undefined);
  expect(read(1)).toBe(undefined);
  expect(read(2.3)).toBe(undefined);
  expect(read("")).toBe(undefined);
  expect(read("text")).toBe(undefined);

  expect(read('"text"')).toEqual("text");
  expect(read("123")).toEqual(123);
  expect(read("1.2")).toEqual(1.2);
  expect(read("[]")).toEqual([]);
  expect(read('[1,"a"]')).toEqual([1, "a"]);
  expect(read("{}")).toEqual({});
  expect(read('{"a":"a","n":5}')).toEqual({ a: "a", n: 5 });
});
