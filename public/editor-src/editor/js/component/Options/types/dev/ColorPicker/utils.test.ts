import {
  setOpacity,
  toggleColor
} from "visual/component/Options/types/dev/ColorPicker/utils";
import { testModelToggle } from "visual/utils/model/utilities.test";
import * as Color from "visual/component/Options/types/dev/ColorPicker/model";
import * as Opacity from "visual/utils/cssProps/opacity";
import * as Palette from "./entities/palette";
import { COLOR3 } from "visual/utils/color/toPalette";
import { Value } from "visual/component/Options/types/dev/ColorPicker/entities/Value";

describe("Testing 'setOpacity' function", function() {
  const v: Value = {
    hex: "#333333",
    opacity: 0.1,
    tempOpacity: 0.5,
    palette: "color3",
    tempPalette: "color5"
  };
  test("If new value !== 0 and final === true, tempOpacity take opacity value", () => {
    expect(setOpacity(Color.setOpacity, 0.6, v, true)).toEqual({
      ...Color.setOpacity(0.6, v),
      tempOpacity: v.opacity
    });
  });

  test("Never update tempOpacity if final is false", () => {
    expect(setOpacity(Color.setOpacity, 0.6, v, false)).toEqual({
      ...Color.setOpacity(0.6, v),
      tempOpacity: v.tempOpacity
    });

    expect(setOpacity(Color.setOpacity, 0, v, false)).toEqual({
      ...Color.setOpacity(0, v),
      tempOpacity: v.tempOpacity
    });
  });
});

describe("Testing 'toggleColor' function", function() {
  const m = {
    opacity: Opacity.empty,
    tempOpacity: 0.5,
    palette: Palette.empty,
    tempPalette: COLOR3
  };
  const getters = [
    [Color.getOpacity, Opacity.empty, 0.5],
    [Color.getPalette, Palette.empty, COLOR3]
  ];
  // @ts-ignore
  testModelToggle(toggleColor, m, getters);
});
