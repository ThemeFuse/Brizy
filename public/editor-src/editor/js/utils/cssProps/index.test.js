import { toBlur, toSpread } from "visual/utils/cssProps";

describe("Testing 'toBlur' function", function() {
  test("If value is not valid, return orElse value", () => {
    [undefined, null, "test", {}].map(v => expect(toBlur(-4, v)).toBe(-4));
  });

  test("Value should be >= 0", () => {
    expect(toBlur(1, 0)).toBe(0);
    expect(toBlur(1, 0.3)).toBe(0.3);
    expect(toBlur(1, -0.3)).toBe(1);
  });
});

describe("Testing 'toSpread' function", function() {
  test("If value is not valid, return orElse value", () => {
    [undefined, null, "test", {}].map(v => expect(toSpread(-4, v)).toBe(-4));
  });

  test("Value should be >= 0", () => {
    expect(toSpread(1, 0)).toBe(0);
    expect(toSpread(1, 0.3)).toBe(0.3);
    expect(toSpread(1, -0.3)).toBe(1);
  });
});
