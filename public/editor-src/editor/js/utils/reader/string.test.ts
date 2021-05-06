import { read } from "./string";

test("Testing 'read' function", () => {
  expect(read(undefined)).toBe(undefined);
  expect(read(null)).toBe(undefined);
  expect(read(NaN)).toBe(undefined);
  expect(read({})).toBe(undefined);
  expect(read([])).toBe(undefined);

  expect(read("")).toBe("");
  expect(read("text")).toBe("text");
  expect(read("4")).toBe("4");
  expect(read(1)).toBe("1");
  expect(read(2.3)).toBe("2.3");
});
