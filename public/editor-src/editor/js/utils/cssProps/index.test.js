import { times, identity as id } from "underscore";
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

  test("Value should be a number", () => {
    const values = [...times(15, id), ...times(15, i => i * -1)];

    values.map(v => expect(toSpread(v)).toBe(v));
  });
});
