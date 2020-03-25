import { empty, onEmpty, palettes, toPalette } from "./palette";
import * as Palette from "./palette";
import * as P from "visual/utils/color/toPalette";
import {
  testMonoidBehavior,
  testToValue
} from "visual/utils/value/utilites.test";
import { testMonoid } from "visual/utils/types/Monoid.test";
import { testReader } from "visual/utils/types/Type.test";

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

describe("Testing 'read' function", function() {
  testReader(Palette.read, Palette.palettes, [
    undefined,
    null,
    "test",
    1,
    [],
    {}
  ]);
});

describe("Testing Palette monoidal behavior", function() {
  testMonoid(Palette, Palette.palettes);
});

describe("Testing 'toPalette' function", function() {
  testToValue(toPalette, palettes, [undefined, null, "test", 1, 2]);
});

describe("Testing 'onEmpty' function", function() {
  testToValue(onEmpty, P.palettes, [undefined, null, empty, "test", 1, 2]);
  testMonoidBehavior(onEmpty, empty, palettes);
});
