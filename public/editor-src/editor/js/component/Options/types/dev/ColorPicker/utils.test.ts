import {
  setOpacity,
  toggleColor
} from "visual/component/Options/types/dev/ColorPicker/utils";
import { testModelToggle } from "visual/utils/model/utilities.test";
import * as Color from "visual/component/Options/types/dev/ColorPicker/model";
import * as Opacity from "visual/utils/cssProps/opacity";
import * as Palette from "./entities/palette";
import * as Hex from "visual/utils/color/Hex";
import { COLOR3 } from "visual/utils/color/Palette";
import { Value } from "visual/component/Options/types/dev/ColorPicker/entities/Value";
import { Black } from "visual/utils/color/Hex";

describe("Testing 'setOpacity' function", function() {
  const v: Value = {
    hex: Hex.unsafe("#333333"),
    opacity: Opacity.unsafe(0.1),
    tempOpacity: Opacity.unsafe(0.5),
    palette: "color3",
    tempPalette: "color5"
  };
  test("If new value !== 0 and final === true, tempOpacity take opacity value", () => {
    expect(setOpacity(Color.setOpacity, Opacity.unsafe(0.6), v, true)).toEqual({
      ...Color.setOpacity(Opacity.unsafe(0.6), v),
      tempOpacity: v.opacity
    });
  });

  test("Never update tempOpacity if final is false", () => {
    expect(setOpacity(Color.setOpacity, Opacity.unsafe(0.6), v, false)).toEqual(
      {
        ...Color.setOpacity(Opacity.unsafe(0.6), v),
        tempOpacity: v.tempOpacity
      }
    );

    expect(setOpacity(Color.setOpacity, Opacity.empty, v, false)).toEqual({
      ...Color.setOpacity(Opacity.empty, v),
      tempOpacity: v.tempOpacity
    });
  });
});

describe("Testing 'toggleColor' function", function() {
  const m: Value = {
    hex: Black,
    opacity: Opacity.empty,
    tempOpacity: Opacity.unsafe(0.5),
    palette: Palette.empty,
    tempPalette: COLOR3
  };
  const getters = [
    [Color.getOpacity, Opacity.empty, Opacity.unsafe(0.5)],
    [Color.getPalette, Palette.empty, COLOR3]
  ];

  // @ts-expect-error
  testModelToggle(toggleColor, m, getters);
});
