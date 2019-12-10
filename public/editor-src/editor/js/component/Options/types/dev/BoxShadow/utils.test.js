import * as T from "visual/component/Options/types/dev/BoxShadow/entities/type";
import { COLOR3 } from "visual/utils/color/toPalette";
import { fromModel, toggleColor, toggleFields, toggleType } from "./utils";
import { _setOpacity } from "visual/component/Options/types/dev/BoxShadow/utils";
import { setOpacity } from "visual/component/Options/types/dev/BoxShadow/model";

describe("Testing 'toggleColor' function", function() {
  test("Set color fields to empty value on disable", () => {
    const model = {
      opacity: 0.6,
      tempOpacity: 0,
      palette: COLOR3,
      tempPalette: ""
    };

    expect(toggleColor(false, model)).toMatchObject({
      opacity: 0,
      tempOpacity: 0.6,
      palette: "",
      tempPalette: COLOR3
    });
  });

  test("Set color fields to none empty value on enable", () => {
    const model = {
      opacity: 0,
      tempOpacity: 0.6,
      palette: "",
      tempPalette: COLOR3
    };

    expect(toggleColor(true, model)).toMatchObject({
      opacity: 0.6,
      tempOpacity: 0.6,
      palette: COLOR3,
      tempPalette: COLOR3
    });
  });
});

describe("Testing 'toggleType' function", function() {
  test("Set type to NONE on disable", () => {
    const model = {
      type: T.OUTSET,
      tempType: T.NONE
    };

    expect(toggleType(false, model)).toMatchObject({
      type: T.NONE,
      tempType: T.OUTSET
    });
  });

  test("On enabled, if type is NONE, set it from temp", () => {
    const model = {
      type: T.NONE,
      tempType: T.INSET
    };

    expect(toggleType(true, model)).toMatchObject({
      type: T.INSET,
      tempType: T.INSET
    });
  });

  test("On enabled, if type is not NONE, keep the value", () => {
    const model = {
      type: T.OUTSET,
      tempType: T.INSET
    };

    expect(toggleType(true, model)).toMatchObject({
      type: T.OUTSET,
      tempType: T.INSET
    });
  });
});

describe("Testing 'toggleFields' function", function() {
  test("Set fields to empty on disable", () => {
    const model = {
      blur: 1,
      tempBlur: 0,
      spread: 1,
      tempSpread: 0,
      vertical: 1,
      tempVertical: 0,
      horizontal: 1,
      tempHorizontal: 0
    };

    expect(toggleFields(false, model)).toMatchObject({
      blur: 0,
      tempBlur: 1,
      spread: 0,
      tempSpread: 1,
      vertical: 0,
      tempVertical: 1,
      horizontal: 0,
      tempHorizontal: 1
    });
  });

  test("Set fields to none empty on enable", () => {
    const model = {
      blur: 0,
      tempBlur: 1,
      spread: 0,
      tempSpread: 1,
      vertical: 0,
      tempVertical: 1,
      horizontal: 0,
      tempHorizontal: 1
    };

    expect(toggleFields(true, model)).toMatchObject({
      blur: 1,
      tempBlur: 1,
      spread: 1,
      tempSpread: 1,
      vertical: 1,
      tempVertical: 1,
      horizontal: 1,
      tempHorizontal: 1
    });
  });

  test("On enable, if field is not empty, keep its value", () => {
    const model = {
      blur: 3,
      tempBlur: 1,
      spread: 3,
      tempSpread: 1,
      vertical: 3,
      tempVertical: 1,
      horizontal: 3,
      tempHorizontal: 1
    };

    expect(toggleFields(true, model)).toMatchObject({
      blur: 3,
      spread: 3,
      vertical: 3,
      horizontal: 3
    });
  });
});

describe("Testing '_setOpacity' function", function() {
  const m = {
    hex: "#333333",
    opacity: 0.1,
    tempOpacity: 0.5,
    palette: "color3",
    tempPalette: "color5"
  };

  test("If new value !== 0 and final === true, tempOpacity take opacity value", () => {
    expect(_setOpacity(0.6, m, true)).toMatchObject({
      tempOpacity: m.opacity
    });
  });

  test("Never update tempOpacity if final is false", () => {
    expect(_setOpacity(0.6, m, false)).toMatchObject({
      tempOpacity: m.tempOpacity
    });

    expect(_setOpacity(0, m, false)).toMatchObject({
      tempOpacity: m.tempOpacity
    });
  });
});

describe("Testing 'fromModel' function", function() {
  test("Should return db model", () => {
    const model = {
      type: "",
      tempType: "",
      hex: "",
      palette: "",
      tempPalette: "",
      opacity: 0,
      tempOpacity: 0,
      blur: 0,
      tempBlur: 0,
      spread: 0,
      tempSpread: 0,
      vertical: 0,
      tempVertical: 0,
      horizontal: 0,
      tempHorizontal: 0
    };

    const result = {
      value: "",
      tempValue: "",
      colorHex: "",
      colorPalette: "",
      tempColorPalette: "",
      colorOpacity: 0,
      tempColorOpacity: 0,
      blur: 0,
      tempBlur: 0,
      spread: 0,
      tempSpread: 0,
      vertical: 0,
      tempVertical: 0,
      horizontal: 0,
      tempHorizontal: 0
    };
    expect(fromModel(model)).toEqual(result);
  });
});
