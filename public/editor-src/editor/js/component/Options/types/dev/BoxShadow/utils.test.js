import * as T from "visual/component/Options/types/dev/BoxShadow/entities/type";
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
import { _setOpacity } from "visual/component/Options/types/dev/BoxShadow/utils";

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
    const model = {
      opacity: 0.6,
      tempOpacity: 0,
      palette: "color3",
      tempPalette: ""
    };

    expect(toggleColor(false, model)).toMatchObject({
      opacity: 0,
      tempOpacity: 0.6,
      palette: "",
      tempPalette: "color3"
    });
  });

  test("Set color fields to none empty value on enable", () => {
    const model = {
      opacity: 0,
      tempOpacity: 0.6,
      palette: "",
      tempPalette: "color3"
    };

    expect(toggleColor(true, model)).toMatchObject({
      opacity: 0.6,
      tempOpacity: 0.6,
      palette: "color3",
      tempPalette: "color3"
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

describe("Testing 'fromElementModel' function", function() {
  const db = {
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
    const model = fromElementModel(k => db[k]);

    const keys = [
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
        expect(model[mK]).toBe(db[dK]);
      }
    );
  });

  describe("Testing model keys default values", function() {
    const keys = [
      ["type", T.empty, { value: undefined }],
      ["tempType", T.OUTSET, { tempValue: undefined }],
      ["hex", "#000000", { colorHex: undefined }],
      ["opacity", Opacity.empty, { colorOpacity: undefined }],
      ["tempOpacity", 1, { tempColorOpacity: undefined }],
      ["palette", Palette.empty, { colorPalette: undefined }],
      ["tempPalette", Palette.empty, { tempColorPalette: undefined }],
      ["blur", 0, { blur: undefined }],
      ["tempBlur", 4, { tempBlur: undefined }],
      ["spread", 0, { spread: undefined }],
      ["tempSpread", 2, { tempSpread: undefined }],
      ["vertical", 0, { vertical: undefined }],
      ["tempVertical", 0, { tempVertical: undefined }],
      ["horizontal", 0, { horizontal: undefined }],
      ["tempHorizontal", 0, { tempHorizontal: undefined }]
    ];

    test.each(keys)(
      "If '%s' is is empty, it should default to %s",
      (k, d, v) => {
        const _db = { ...db, ...v };
        expect(fromElementModel(k => _db[k])).toMatchObject({ [k]: d });
      }
    );
  });

  test("If type is 'none', then opacity, palette, blur and spread are set to their empty values", () => {
    const _db = { ...db, value: T.empty };
    const r = fromElementModel(k => _db[k]);

    expect(r.opacity).toBe(Opacity.empty);
    expect(r.palette).toBe(Palette.empty);
    expect(r.blur).toBe(0);
    expect(r.spread).toBe(0);
  });

  test("If opacity is 0, then type, palette, blur and spread are set to their empty values", () => {
    const _db = { ...db, colorOpacity: Opacity.empty };
    const r = fromElementModel(k => _db[k]);

    expect(r.type).toBe(T.NONE);
    expect(r.palette).toBe(Palette.empty);
    expect(r.blur).toBe(0);
    expect(r.spread).toBe(0);
  });

  test("If spread and blur are 0, then type, palette, opacity are set to their empty values", () => {
    const _db = { ...db, spread: 0, blur: 0 };
    const r = fromElementModel(k => _db[k]);

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
      const _db = { ...db, ...v };
      const r = fromElementModel(k => _db[k]);

      expect(r.type).toBe(_db.value);
      expect(r.palette).toBe(_db.colorPalette);
      expect(r.opacity).toBe(_db.colorOpacity);
    });
  });

  test("If type is '', it is transformed to 'none'", () => {
    const _db = { ...db, value: "" };

    expect(fromElementModel(k => _db[k]).type).toBe(T.NONE);
  });

  test("If type is 'on', it is transformed to 'outset'", () => {
    const _db = { ...db, value: "on" };

    expect(fromElementModel(k => _db[k]).type).toBe(T.OUTSET);
  });
});

describe("Testing 'toElementModel' function", function() {
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
    expect(toElementModel(model)).toEqual(result);
  });
});

describe("Testing 'fieldsEnabled' function", function() {
  test.each([
    "blur",
    "spread"
  ])("Fields are enabled if '%s' value is higher then 0", k =>
    expect(fieldsEnabled({ [k]: 1 })).toBe(true)
  );

  test("Fields are not enabled if blur and spread values are 0", () => {
    expect(fieldsEnabled({ blur: 0, spread: 0 })).toBe(false);
  });
});
