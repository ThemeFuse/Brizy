import { palettes } from "visual/utils/color/Palette";

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
