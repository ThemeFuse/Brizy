import { parseCustomAttributes } from "visual/utils/string/parseCustomAttributes";

describe("Testing 'parseCustomAttributes' function", function() {
  test("Return empty object, if the string is empty", () => {
    expect(parseCustomAttributes("")).toEqual({});
  });

  test("Attribute name and value should be separated by ':'", () => {
    expect(parseCustomAttributes("test:1")).toEqual({ test: "1" });
  });

  test("Attributes should be separated by newline", () => {
    expect(parseCustomAttributes("test1:1\ntest2:2")).toEqual({
      test1: "1",
      test2: "2"
    });
  });
});
