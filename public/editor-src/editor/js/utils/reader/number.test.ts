import { read } from "./number";

test("Testing 'read' function", () => {
  expect(read(undefined)).toBe(undefined);
  expect(read(null)).toBe(undefined);
  expect(read(NaN)).toBe(undefined);
  expect(read({})).toBe(undefined);
  expect(read([])).toBe(undefined);
  expect(read("")).toBe(undefined);
  expect(read("text")).toBe(undefined);
  expect(read("1,2")).toBe(undefined); // must be "1.2"

  expect(read(1)).toBe(1);
  expect(read(2.3)).toBe(2.3);
  expect(read("4")).toBe(4);
  expect(read("4.5")).toBe(4.5);
});
