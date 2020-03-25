import { palettes, toPalette, read } from "visual/utils/color/toPalette";
import { testReader } from "visual/utils/types/Type.test";

describe("Testing 'palettes' constant", function() {
  test("Should be: ['color1', 'color2', 'color3', 'color4', 'color5', 'color6', 'color7', 'color8']", () => {
    const ps = [
      "color1",
      "color2",
      "color3",
      "color4",
      "color5",
      "color6",
      "color7",
      "color8"
    ];

    expect(palettes).toEqual(ps);
  });
});

describe("Testing 'read' function", function() {
  testReader(read, palettes, [undefined, null, "!", 2, [], {}]);
});

describe("Testing 'toPalette' function", function() {
  test("Return palette if it is valid palette", () => {
    palettes.map(p => expect(toPalette("color1", p)).toBe(p));
  });

  test("Return orElse if value is not a valid palette", () => {
    expect(toPalette("color3", "test")).toBe("color3");
  });
});
