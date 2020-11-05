import { hasSizing } from "./utils";

describe("Testing 'hasSizing' function", function() {
  test("if width and height values are numbers, return true", () => {
    expect(hasSizing({ width: 40, height: 50 }, "desktop", "normal")).toBe(
      true
    );
    expect(hasSizing({ width: 0, height: 0 }, "desktop", "normal")).toBe(true);
  });

  test("if width is not a numbers, return false", () => {
    expect(hasSizing({ height: 50 }, "desktop", "normal")).toBe(false);
    expect(hasSizing({ width: null, height: 0 }, "desktop", "normal")).toBe(
      false
    );
  });
  test("if height is not a numbers, return false", () => {
    expect(hasSizing({ width: 50 }, "desktop", "normal")).toBe(false);
    expect(hasSizing({ width: 50, height: null }, "desktop", "normal")).toBe(
      false
    );
  });
});
