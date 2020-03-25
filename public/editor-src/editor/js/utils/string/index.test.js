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

describe("Testing 'toString' function", function() {
  test("if value is string type, return value", () => {
    ["", "0", "test"].map(v => expect(toString(v)).toBe(v));
  });

  test("if value is not string type, return empty string", () => {
    [undefined, null, 1, {}, () => ({})].map(v =>
      expect(toString(v, "")).toBe("")
    );
  });
});

describe("Testing 'onEmpty' function", function() {
  testToValue(onEmpty, ["0", "test"], [undefined, null, "", 1, {}]);

  testMonoidBehavior(onEmpty, "", ["0", "test"]);
});

describe("Testing 'capitalize' function", function() {
  test("Return empty string for empty strings", () => {
    expect(capitalize("")).toBe("");
  });
  test("Uppercase the first letter from string", () => {
    expect(capitalize("test")).toBe("Test");
    expect(capitalize(" test")).toBe(" test");
  });
});

describe("Testing 'capByPrefix' function", function() {
  test("Do not capitalize, if prefix is empty", () => {
    expect(capByPrefix("", "test")).toBe("test");
  });

  test("Capitalize the string if the prefix is not empty", () => {
    expect(capByPrefix("prefix", "test")).toBe("prefixTest");
  });
});

describe("Testing 'camelCase' function", function() {
  test("Do not capitalize if there one word", () => {
    expect(camelCase(["test"])).toBe("test");
  });

  test("Always capitalize tail", () => {
    expect(camelCase(["nonecap", "cap", "cap"])).toBe("nonecapCapCap");
  });
});
