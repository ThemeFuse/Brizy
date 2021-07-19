import { read, readWithItemReader } from "./array";
import { read as readString } from "./string";
import { read as readNumber } from "./number";

test("Testing 'read' function", () => {
  expect(read(undefined)).toBe(undefined);
  expect(read(null)).toBe(undefined);
  expect(read(NaN)).toBe(undefined);
  expect(read({})).toBe(undefined);
  expect(read("")).toBe(undefined);
  expect(read("text")).toBe(undefined);
  expect(read("[4]")).toBe(undefined);
  expect(read(1)).toBe(undefined);
  expect(read(2.3)).toBe(undefined);

  expect(read([])).toEqual([]);
  expect(read([1, 2, 3])).toEqual([1, 2, 3]);
  expect(read(["a", "b", "c"])).toEqual(["a", "b", "c"]);
  expect(read([{}, 123])).toEqual([{}, 123]);
});

test("Testing 'readWithItemReader' function", () => {
  expect(readWithItemReader(readString)([])).toEqual([]);
  expect(readWithItemReader(readNumber)([])).toEqual([]);

  expect(readWithItemReader(readString)(["a", "b"])).toEqual(["a", "b"]);
  expect(readWithItemReader(readString)(["a", {}])).toEqual(undefined);

  expect(readWithItemReader(readNumber)([1, 2, 3])).toEqual([1, 2, 3]);
  expect(readWithItemReader(readNumber)([1, "a", 2, 3])).toEqual(undefined);
});
