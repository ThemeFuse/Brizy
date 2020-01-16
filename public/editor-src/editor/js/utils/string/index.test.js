import { camelCase, capByPrefix, capitalize } from "visual/utils/string/index";

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
  test("Return empty string if the words parameter is not an array", () => {
    [1, "test", {}].map(v => expect(camelCase(v)).toBe(""));
  });

  test("Do not capitalize if there one word", () => {
    expect(camelCase(["test"])).toBe("test");
  });

  test("Always capitalize tail", () => {
    expect(camelCase(["nonecap", "cap", "cap"])).toBe("nonecapCapCap");
  });
});
