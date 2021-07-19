import { empty, palettes } from "./palette";
import * as Palette from "./palette";
import { testMonoid } from "visual/utils/types/Monoid.test";

describe("Test 'empty' value", function() {
  test("Empty value should be ''", () => {
    expect(empty).toBe("");
  });
});

describe("Test 'palettes' value", function() {
  test("Palettes should be ['', 'color1', 'color1', 'color3', 'color4', 'color5', 'color6', 'color7', 'color8', ]", () => {
    expect(palettes).toEqual([
      "",
      "color1",
      "color2",
      "color3",
      "color4",
      "color5",
      "color6",
      "color7",
      "color8"
    ]);
  });
});

describe("Testing Palette monoidal behavior", function() {
  testMonoid(Palette, Palette.palettes);
});
