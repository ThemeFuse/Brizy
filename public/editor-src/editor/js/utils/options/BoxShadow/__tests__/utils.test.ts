import * as Hex from "visual/utils/color/Hex";
import * as Blur from "visual/utils/cssProps/Blur";
import * as Opacity from "visual/utils/cssProps/opacity";
import * as T from "../entities/Type";
import { Value } from "../entities/Value";
import {
  _setOpacity,
  fieldsEnabled,
  fromLegacyType,
  toLegacyType,
  toggleColor,
  toggleFields,
  toggleType
} from "../utils";

const model: Value = {
  type: "inset",
  tempType: "outset",
  hex: Hex.Black,
  opacity: Opacity.unsafe(1),
  tempOpacity: Opacity.unsafe(1),
  blur: Blur.unsafe(0.3),
  tempBlur: Blur.unsafe(0.3),
  spread: 0.3,
  tempSpread: 0.3,
  palette: "color1",
  tempPalette: "color2",
  vertical: 1,
  tempVertical: 2,
  horizontal: 3,
  tempHorizontal: 4
};

describe("Testing 'fromLegacyType' function", function () {
  test("if value is 'on', return 'outset'", () => {
    expect(fromLegacyType("on")).toBe(T.OUTSET);
  });

  test("if value is not 'on', return the value", () => {
    T.types.map((t) => expect(fromLegacyType(t)).toBe(t));
  });
});

describe("Testing 'toLegacyType' function", function () {
  test("if value is 'outset', return 'on'", () => {
    expect(toLegacyType(T.OUTSET)).toBe("on");
  });

  test("if value is 'none', return ''", () => {
    expect(toLegacyType(T.NONE)).toBe("");
  });

  test("if value is not '' or 'on', return the value", () => {
    T.types.map((t) => expect(fromLegacyType(t)).toBe(t));
  });
});

describe("Testing 'toggleColor' function", function () {
  test("Set color fields to empty value on disable", () => {
    const m: Value = {
      ...model,
      opacity: Opacity.unsafe(0.6),
      tempOpacity: Opacity.unsafe(0),
      palette: "color3",
      tempPalette: ""
    };

    expect(toggleColor(false, m)).toMatchObject({
      opacity: 0,
      tempOpacity: 0.6,
      palette: "",
      tempPalette: "color3"
    });
  });

  test("Set color fields to none empty value on enable", () => {
    const m: Value = {
      ...model,
      opacity: Opacity.unsafe(0),
      tempOpacity: Opacity.unsafe(0.6),
      palette: "",
      tempPalette: "color3"
    };

    expect(toggleColor(true, m)).toMatchObject({
      opacity: 0.6,
      tempOpacity: 0.6,
      palette: "color3",
      tempPalette: "color3"
    });
  });
});

describe("Testing 'toggleType' function", function () {
  test("Set type to NONE on disable", () => {
    const m: Value = {
      ...model,
      type: T.OUTSET,
      tempType: T.NONE
    };

    expect(toggleType(false, m)).toMatchObject({
      type: T.NONE,
      tempType: T.OUTSET
    });
  });

  test("On enabled, if type is NONE, set it from temp", () => {
    const m: Value = {
      ...model,
      type: T.NONE,
      tempType: T.INSET
    };

    expect(toggleType(true, m)).toMatchObject({
      type: T.INSET,
      tempType: T.INSET
    });
  });

  test("On enabled, if type is not NONE, keep the value", () => {
    const m: Value = {
      ...model,
      type: T.OUTSET,
      tempType: T.INSET
    };

    expect(toggleType(true, m)).toMatchObject({
      type: T.OUTSET,
      tempType: T.INSET
    });
  });
});

describe("Testing 'toggleFields' function", function () {
  test("Set fields to empty on disable", () => {
    const m: Value = {
      ...model,
      blur: Blur.unsafe(1),
      tempBlur: Blur.empty,
      spread: 1,
      tempSpread: 0,
      vertical: 1,
      tempVertical: 0,
      horizontal: 1,
      tempHorizontal: 0
    };

    expect(toggleFields(false, m)).toMatchObject({
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
    const m: Value = {
      ...model,
      blur: Blur.empty,
      tempBlur: Blur.unsafe(1),
      spread: 0,
      tempSpread: 1,
      vertical: 0,
      tempVertical: 1,
      horizontal: 0,
      tempHorizontal: 1
    };

    expect(toggleFields(true, m)).toMatchObject({
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
    const m: Value = {
      ...model,
      blur: Blur.unsafe(3),
      tempBlur: Blur.unsafe(1),
      spread: 3,
      tempSpread: 1,
      vertical: 3,
      tempVertical: 1,
      horizontal: 3,
      tempHorizontal: 1
    };

    expect(toggleFields(true, m)).toMatchObject({
      blur: 3,
      spread: 3,
      vertical: 3,
      horizontal: 3
    });
  });
});

describe("Testing '_setOpacity' function", function () {
  const m: Value = {
    ...model,
    hex: Hex.unsafe("#333333"),
    opacity: Opacity.unsafe(0.1),
    tempOpacity: Opacity.unsafe(0.5),
    palette: "color3",
    tempPalette: "color5"
  };

  test("If new value !== 0 and final === true, tempOpacity take opacity value", () => {
    expect(_setOpacity(Opacity.unsafe(0.6), m, true)).toMatchObject({
      tempOpacity: m.opacity
    });
  });

  test("Never update tempOpacity if final is false", () => {
    expect(_setOpacity(Opacity.unsafe(0.6), m, false)).toMatchObject({
      tempOpacity: m.tempOpacity
    });

    expect(_setOpacity(Opacity.empty, m, false)).toMatchObject({
      tempOpacity: m.tempOpacity
    });
  });
});

describe("Testing 'fieldsEnabled' function", function () {
  test.each(["blur", "spread", "horizontal", "vertical"])(
    "Fields are enabled if '%s' value is higher then 0",
    (k) => expect(fieldsEnabled({ ...model, [k]: 1 })).toBe(true)
  );

  test("Fields are not enabled only if all values (blur, spread, horizontal, vertical) are 0", () => {
    expect(
      fieldsEnabled({
        ...model,
        blur: Blur.empty,
        spread: 0,
        horizontal: 0,
        vertical: 0
      })
    ).toBe(false);
  });

  test("Fields are enabled if any value is non-zero", () => {
    expect(
      fieldsEnabled({
        ...model,
        blur: Blur.empty,
        spread: 0,
        horizontal: 0,
        vertical: 1
      })
    ).toBe(true);

    expect(
      fieldsEnabled({
        ...model,
        blur: Blur.empty,
        spread: 0,
        horizontal: 1,
        vertical: 0
      })
    ).toBe(true);

    expect(
      fieldsEnabled({
        ...model,
        blur: Blur.empty,
        spread: 1,
        horizontal: 0,
        vertical: 0
      })
    ).toBe(true);

    expect(
      fieldsEnabled({
        ...model,
        blur: Blur.unsafe(1),
        spread: 0,
        horizontal: 0,
        vertical: 0
      })
    ).toBe(true);
  });
});
