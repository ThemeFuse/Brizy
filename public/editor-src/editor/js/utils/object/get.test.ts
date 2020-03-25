import { get, getOr } from "./get";

type Test = {
  test: number;
};

describe("Testing 'get' function", function() {
  test("Return value under specified key", () => {
    expect(get("test", { test: 1 })).toBe(1);
  });

  test("Return undefined if model is undefined", () => {
    expect(get<Test, "test">("test", undefined)).toBe(undefined);
  });
});

describe("Testing 'getOr' function", function() {
  test("Return value under specified key", () => {
    expect(getOr(2, "test", { test: 1 })).toBe(1);
  });

  test("Return orElse if model is undefined", () => {
    expect(getOr<Test, "test">(2, "test", undefined)).toBe(2);
  });
});
