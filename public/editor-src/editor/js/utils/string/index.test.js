import {
  camelCase,
  capByPrefix,
  capitalize,
  onEmpty,
  toString
} from "visual/utils/string/index";
import {
  testMonoidBehavior,
  testToValue
} from "visual/utils/value/utilites.test";
import { snakeCase } from "./index";

describe("Testing 'toString' function", function () {
  test("if value is string type, return value", () => {
    ["", "0", "test"].map((v) => expect(toString(v)).toBe(v));
  });

  test("if value is not string type, return empty string", () => {
    [undefined, null, 1, {}, () => ({})].map((v) =>
      expect(toString(v, "")).toBe("")
    );
  });
});

describe("Testing 'snakeCase' function", function () {
  test("converts a string with spaces to snake_case", () => {
    const inputOutputPairs = [
      { input: "hello world", expected: "hello_world" },
      { input: "snake case function", expected: "snake_case_function" },
      {
        input: "   leading and trailing spaces   ",
        expected: "leading_and_trailing_spaces"
      },
      { input: "multiple   spaces", expected: "multiple_spaces" }
    ];
    inputOutputPairs.forEach((pair) => {
      expect(snakeCase(pair.input)).toBe(pair.expected);
    });
  });

  test("converts uppercase characters to lowercase and replaces spaces", () => {
    const inputOutputPairs = [
      { input: "Hello World", expected: "hello_world" },
      { input: "Snake CASE Function", expected: "snake_case_function" }
    ];
    inputOutputPairs.forEach((pair) => {
      expect(snakeCase(pair.input)).toBe(pair.expected);
    });
  });

  test("returns empty string if input is empty", () => {
    expect(snakeCase("")).toBe("");
  });

  test("handles strings with no spaces correctly", () => {
    const inputOutputPairs = [
      { input: "nospace", expected: "nospace" },
      { input: "Already_Snake_Case", expected: "already_snake_case" }
    ];
    inputOutputPairs.forEach((pair) => {
      expect(snakeCase(pair.input)).toBe(pair.expected);
    });
  });
});

describe("Testing 'onEmpty' function", function () {
  testToValue(onEmpty, ["0", "test"], [undefined, null, "", 1, {}]);

  testMonoidBehavior(onEmpty, "", ["0", "test"]);
});

describe("Testing 'capitalize' function", function () {
  test("Return empty string for empty strings", () => {
    expect(capitalize("")).toBe("");
  });
  test("Uppercase the first letter from string", () => {
    expect(capitalize("test")).toBe("Test");
    expect(capitalize(" test")).toBe(" test");
  });
});

describe("Testing 'capByPrefix' function", function () {
  test("Do not capitalize, if prefix is empty", () => {
    expect(capByPrefix("", "test")).toBe("test");
  });

  test("Capitalize the string if the prefix is not empty", () => {
    expect(capByPrefix("prefix", "test")).toBe("prefixTest");
  });
});

describe("Testing 'camelCase' function", function () {
  test("Do not capitalize if there one word", () => {
    expect(camelCase(["test"])).toBe("test");
  });

  test("Always capitalize tail", () => {
    expect(camelCase(["nonecap", "cap", "cap"])).toBe("nonecapCapCap");
  });
});
