import { fromUnknown, is } from "./bool";

const valid = [true, false];
const invalid = ["", 1, 0, {}, [], null, undefined];

describe("Testing 'is' function", () => {
  describe("Test valid cases", () => {
    valid.forEach((v) =>
      test(`If value is ${v}, return true`, () => expect(is(v)).toBe(true))
    );
  });

  describe("Test invalid cases", () => {
    invalid.forEach((v) =>
      test(`If value is ${JSON.stringify(v)}, return false`, () =>
        expect(is(v)).toBe(false))
    );
  });
});

describe("Testing 'fromUnknown' function", () => {
  describe("Return v if it passes the `if` function, otherwise, return undefined", () => {
    [...valid, ...invalid].forEach((v) =>
      test(`On ${JSON.stringify(v)}, return ${JSON.stringify(
        fromUnknown(v)
      )}`, () => expect(fromUnknown(v)).toBe(is(v) ? v : undefined))
    );
  });
});
