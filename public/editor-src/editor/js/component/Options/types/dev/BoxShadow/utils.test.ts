import * as T from "visual/component/Options/types/dev/BoxShadow/entities/Type";
import * as Palette from "visual/component/Options/types/dev/ColorPicker/entities/palette";
import * as Opacity from "visual/utils/cssProps/opacity";
import {
  fieldsEnabled,
  fromElementModel,
  fromLegacyType,
  toElementModel,
  toggleColor,
  toggleFields,
  toggleType,
  toLegacyType
} from "./utils";
import { _setOpacity } from "./utils";
import { Value } from "./entities/Value";
import * as Hex from "visual/utils/color/Hex";
import * as Blur from "visual/utils/cssProps/Blur";
import * as Spread from "visual/utils/cssProps/Spread";
import { ElementModel } from "visual/component/Elements/Types";
import { MValue } from "visual/utils/value";
import { Literal } from "visual/utils/types/Literal";
import { Black } from "visual/utils/color/Hex";

const model: Value = {
  type: "inset",
  tempType: "outset",
  hex: Hex.Black,
  opacity: Opacity.unsafe(1),
  tempOpacity: Opacity.unsafe(1),
  blur: Blur.unsafe(0.3),
  tempBlur: Blur.unsafe(0.3),
  spread: Spread.unsafe(0.3),
  tempSpread: Spread.unsafe(0.3),
  palette: "color1",
  tempPalette: "color2",
  vertical: 1,
  tempVertical: 2,
  horizontal: 3,
  tempHorizontal: 4
};

describe("Testing 'fromLegacyType' function", function() {
  test("if value is 'on', return 'outset'", () => {
    expect(fromLegacyType("on")).toBe(T.OUTSET);
  });

  test("if value is not 'on', return the value", () => {
    T.types.map(t => expect(fromLegacyType(t)).toBe(t));
  });
});

describe("Testing 'toLegacyType' function", function() {
  test("if value is 'outset', return 'on'", () => {
    expect(toLegacyType(T.OUTSET)).toBe("on");
  });

  test("if value is 'none', return ''", () => {
    expect(toLegacyType(T.NONE)).toBe("");
  });

  test("if value is not '' or 'on', return the value", () => {
    T.types.map(t => expect(fromLegacyType(t)).toBe(t));
  });
});

describe("Testing 'toggleColor' function", function() {
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

describe("Testing 'toggleType' function", function() {
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

describe("Testing 'toggleFields' function", function() {
  test("Set fields to empty on disable", () => {
    const m: Value = {
      ...model,
      blur: Blur.unsafe(1),
      tempBlur: Blur.empty,
      spread: Spread.unsafe(1),
      tempSpread: Spread.empty,
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
      spread: Spread.empty,
      tempSpread: Spread.unsafe(1),
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
      spread: Spread.unsafe(3),
      tempSpread: Spread.unsafe(1),
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

describe("Testing '_setOpacity' function", function() {
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

describe("Testing 'fromElementModel' function", function() {
  const db: ElementModel = {
    value: T.OUTSET,
    tempValue: T.INSET,
    colorHex: "#333",
    colorOpacity: 0.3,
    tempColorOpacity: 0.4,
    colorPalette: "color3",
    tempColorPalette: "color4",
    blur: 2,
    tempBlur: 3,
    spread: 4,
    tempSpread: 5,
    vertical: 6,
    tempVertical: 7,
    horizontal: 8,
    tempHorizontal: 9
  };

  describe("Testing the keys that should match", () => {
    const model = fromElementModel(k => db[k] as MValue<Literal>);

    const keys: Array<[keyof typeof db, keyof Value]> = [
      ["value", "type"],
      ["tempValue", "tempType"],
      ["colorHex", "hex"],
      ["colorOpacity", "opacity"],
      ["tempColorOpacity", "tempOpacity"],
      ["colorPalette", "palette"],
      ["tempColorPalette", "tempPalette"],
      ["blur", "blur"],
      ["tempBlur", "tempBlur"],
      ["spread", "spread"],
      ["tempSpread", "tempSpread"],
      ["vertical", "vertical"],
      ["tempVertical", "tempVertical"],
      ["horizontal", "horizontal"],
      ["tempHorizontal", "tempHorizontal"]
    ];

    test.each(keys)(
      "The '%s' element model key represents '%s' model key",
      (mK, dK) => {
        expect(model[mK as keyof Value]).toBe(db[dK]);
      }
    );
  });

  describe("Testing model keys default values", function() {
    const keys: Array<[keyof Value, Value[keyof Value], ElementModel]> = [
      ["type", T.empty, { value: undefined }],
      ["tempType", T.OUTSET, { tempValue: undefined }],
      ["hex", Black, { colorHex: undefined }],
      ["opacity", Opacity.empty, { colorOpacity: undefined }],
      ["tempOpacity", Opacity.unsafe(1), { tempColorOpacity: undefined }],
      ["palette", Palette.empty, { colorPalette: undefined }],
      ["tempPalette", Palette.empty, { tempColorPalette: undefined }],
      ["blur", Blur.empty, { blur: undefined }],
      ["tempBlur", Blur.unsafe(4), { tempBlur: undefined }],
      ["spread", Spread.empty, { spread: undefined }],
      ["tempSpread", Spread.unsafe(2), { tempSpread: undefined }],
      ["vertical", 0, { vertical: undefined }],
      ["tempVertical", 0, { tempVertical: undefined }],
      ["horizontal", 0, { horizontal: undefined }],
      ["tempHorizontal", 0, { tempHorizontal: undefined }]
    ];

    test.each(keys)(
      "If '%s' is is empty, it should default to %s",
      (k, d, v) => {
        const _db = { ...db, ...v };
        expect(fromElementModel(k => _db[k] as MValue<Literal>)).toMatchObject({
          [k]: d
        });
      }
    );
  });

  test("If type is 'none', then opacity, palette, blur and spread are set to their empty values", () => {
    const _db: ElementModel = { ...db, value: T.empty };
    const r = fromElementModel(k => _db[k] as MValue<Literal>);

    expect(r.opacity).toBe(Opacity.empty);
    expect(r.palette).toBe(Palette.empty);
    expect(r.blur).toBe(0);
    expect(r.spread).toBe(0);
  });

  test("If opacity is 0, then type, palette, blur and spread are set to their empty values", () => {
    const _db: ElementModel = { ...db, colorOpacity: Opacity.empty };
    const r = fromElementModel(k => _db[k] as MValue<Literal>);

    expect(r.type).toBe(T.NONE);
    expect(r.palette).toBe(Palette.empty);
    expect(r.blur).toBe(0);
    expect(r.spread).toBe(0);
  });

  test("If spread and blur are 0, then type, palette, opacity are set to their empty values", () => {
    const _db: ElementModel = { ...db, spread: 0, blur: 0 };
    const r = fromElementModel(k => _db[k] as MValue<Literal>);

    expect(r.type).toBe(T.NONE);
    expect(r.palette).toBe(Palette.empty);
    expect(r.opacity).toBe(Opacity.empty);
  });

  test("If spread or blur is not empty, do not empty type, palette, opacity", () => {
    [
      { blur: 1, spread: 0 },
      { blur: 0, spread: 1 },
      { blur: 1, spread: 1 }
    ].map(v => {
      const _db: ElementModel = { ...db, ...v };
      const r = fromElementModel(k => _db[k] as MValue<Literal>);

      expect(r.type).toBe(_db.value);
      expect(r.palette).toBe(_db.colorPalette);
      expect(r.opacity).toBe(_db.colorOpacity);
    });
  });

  test("If type is '', it is transformed to 'none'", () => {
    const _db: ElementModel = { ...db, value: "" };

    expect(fromElementModel(k => _db[k] as MValue<Literal>).type).toBe(T.NONE);
  });

  test("If type is 'on', it is transformed to 'outset'", () => {
    const _db: ElementModel = { ...db, value: "on" };

    expect(fromElementModel(k => _db[k] as MValue<Literal>).type).toBe(
      T.OUTSET
    );
  });
});

describe("Testing 'toElementModel' function", function() {
  test("Should return db model", () => {
    const model: Value = {
      type: T.empty,
      tempType: T.OUTSET,
      hex: Black,
      palette: "",
      tempPalette: "",
      opacity: Opacity.empty,
      tempOpacity: Opacity.unsafe(1),
      blur: Blur.empty,
      tempBlur: Blur.unsafe(2),
      spread: Spread.empty,
      tempSpread: Spread.unsafe(2),
      vertical: 0,
      tempVertical: 0,
      horizontal: 0,
      tempHorizontal: 0
    };

    const result: ElementModel = {
      value: "",
      tempValue: "on",
      colorHex: Black,
      colorPalette: "",
      tempColorPalette: "",
      colorOpacity: 0,
      tempColorOpacity: 1,
      blur: 0,
      tempBlur: 2,
      spread: 0,
      tempSpread: 2,
      vertical: 0,
      tempVertical: 0,
      horizontal: 0,
      tempHorizontal: 0
    };
    expect(toElementModel(model, k => k)).toEqual(result);
  });
});

describe("Testing 'fieldsEnabled' function", function() {
  test.each([
    "blur",
    "spread"
  ])("Fields are enabled if '%s' value is higher then 0", k =>
    expect(fieldsEnabled({ ...model, [k]: 1 })).toBe(true)
  );

  test("Fields are not enabled if blur and spread values are 0", () => {
    expect(
      fieldsEnabled({ ...model, blur: Blur.empty, spread: Spread.empty })
    ).toBe(false);
  });
});
