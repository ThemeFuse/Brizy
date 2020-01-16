import { COLOR3, palettes, toPalette } from "visual/utils/color/toPalette";

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

describe("Testing 'toPalette' function", function() {
  test("Return palette if it is valid palette", () => {
    palettes.map(p => expect(toPalette("test", p)).toBe(p));
  });

  test("Return orElse if value is not a valid palette", () => {
    expect(toPalette(COLOR3, "test")).toBe(COLOR3);
  });
});
