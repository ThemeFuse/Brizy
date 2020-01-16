import { setOpacity } from "visual/component/Options/types/dev/ColorPicker/utils";
import { setOpacity as _setOpacity } from "visual/component/Options/types/dev/ColorPicker/model";

describe("Testing 'setOpacity' function", function() {
  const v = {
    hex: "#333333",
    opacity: 0.1,
    tempOpacity: 0.5,
    palette: "color3",
    tempPalette: "color5"
  };
  test("If new value !== 0 and final === true, tempOpacity take opacity value", () => {
    expect(setOpacity(0.6, v, true)).toEqual({
      ..._setOpacity(0.6, v),
      tempOpacity: v.opacity
    });
  });

  test("Never update tempOpacity if final is false", () => {
    expect(setOpacity(0.6, v, false)).toEqual({
      ..._setOpacity(0.6, v),
      tempOpacity: v.tempOpacity
    });

    expect(setOpacity(0, v, false)).toEqual({
      ..._setOpacity(0, v),
      tempOpacity: v.tempOpacity
    });
  });
});
