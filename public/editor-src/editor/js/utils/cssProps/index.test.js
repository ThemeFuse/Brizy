import { toBlur, toSpread } from "visual/utils/cssProps";

describe("Testing 'toBlur' function", function() {
  test("If value is not valid, return orElse value", () => {
    [undefined, null, "test", {}].map(v => expect(toBlur(v, -4)).toBe(-4));
  });

  test("Value should be >= 0", () => {
    expect(toBlur(0, 1)).toBe(0);
    expect(toBlur(0.3, 1)).toBe(0.3);
    expect(toBlur(-0.3, 1)).toBe(1);
  });
});

describe("Testing 'toSpread' function", function() {
  test("If value is not valid, return orElse value", () => {
    [undefined, null, "test", {}].map(v => expect(toSpread(v, -4)).toBe(-4));
  });

  test("Value should be >= 0", () => {
    expect(toSpread(0, 1)).toBe(0);
    expect(toSpread(0.3, 1)).toBe(0.3);
    expect(toSpread(-0.3, 1)).toBe(1);
  });
});
