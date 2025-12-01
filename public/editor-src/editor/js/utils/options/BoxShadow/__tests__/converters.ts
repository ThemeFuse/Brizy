import { ElementModel } from "visual/component/Elements/Types";
import { Black } from "visual/utils/color/Hex";
import * as Blur from "visual/utils/cssProps/Blur";
import * as Opacity from "visual/utils/cssProps/opacity";
import { Literal } from "visual/utils/types/Literal";
import { MValue } from "visual/utils/value";
import * as Palette from "../../ColorPicker/entities/palette";
import { fromElementModel, toElementModel } from "../converters";
import * as T from "../entities/Type";
import { Value } from "../entities/Value";

describe("Testing 'fromElementModel' function", function () {
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
    const model = fromElementModel((k) => db[k] as MValue<Literal>);

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

  describe("Testing model keys default values", function () {
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
        expect(
          fromElementModel((k) => _db[k] as MValue<Literal>)
        ).toMatchObject({
          [k]: d
        });
      }
    );
  });

  test("If type is 'none', then opacity, palette, blur and spread are set to their empty values", () => {
    const _db: ElementModel = { ...db, value: T.empty };
    const r = fromElementModel((k) => _db[k] as MValue<Literal>);

    expect(r.opacity).toBe(Opacity.empty);
    expect(r.palette).toBe(Palette.empty);
    expect(r.blur).toBe(0);
    expect(r.spread).toBe(0);
  });

  test("If opacity is 0, then type, palette, blur and spread are set to their empty values", () => {
    const _db: ElementModel = { ...db, colorOpacity: Opacity.empty };
    const r = fromElementModel((k) => _db[k] as MValue<Literal>);

    expect(r.type).toBe(T.NONE);
    expect(r.palette).toBe(Palette.empty);
    expect(r.blur).toBe(0);
    expect(r.spread).toBe(0);
  });

  test("If all fields (blur, spread, horizontal, vertical) are 0, then type, palette, opacity are set to their empty values", () => {
    const _db: ElementModel = {
      ...db,
      spread: 0,
      blur: 0,
      horizontal: 0,
      vertical: 0
    };
    const r = fromElementModel((k) => _db[k] as MValue<Literal>);

    expect(r.type).toBe(T.NONE);
    expect(r.palette).toBe(Palette.empty);
    expect(r.opacity).toBe(Opacity.empty);
  });

  test.each([
    {
      blur: 1,
      spread: 0,
      horizontal: 0,
      vertical: 0,
      description: "only blur is non-zero"
    },
    {
      blur: 0,
      spread: 1,
      horizontal: 0,
      vertical: 0,
      description: "only spread is non-zero"
    },
    {
      blur: 0,
      spread: 0,
      horizontal: 1,
      vertical: 0,
      description: "only horizontal is non-zero"
    },
    {
      blur: 0,
      spread: 0,
      horizontal: 0,
      vertical: 1,
      description: "only vertical is non-zero"
    },
    {
      blur: 1,
      spread: 1,
      horizontal: 0,
      vertical: 0,
      description: "blur and spread are non-zero"
    },
    {
      blur: 0,
      spread: 0,
      horizontal: 1,
      vertical: 1,
      description: "horizontal and vertical are non-zero"
    }
  ])(
    "If $description, do not empty type, palette, opacity",
    ({ blur, spread, horizontal, vertical }) => {
      const _db: ElementModel = { ...db, blur, spread, horizontal, vertical };
      const r = fromElementModel((k) => _db[k] as MValue<Literal>);

      expect(r.type).toBe(_db.value);
      expect(r.palette).toBe(_db.colorPalette);
      expect(r.opacity).toBe(_db.colorOpacity);
    }
  );

  test("If type is '', it is transformed to 'none'", () => {
    const _db: ElementModel = { ...db, value: "" };

    expect(fromElementModel((k) => _db[k] as MValue<Literal>).type).toBe(
      T.NONE
    );
  });

  test("If type is 'on', it is transformed to 'outset'", () => {
    const _db: ElementModel = { ...db, value: "on" };

    expect(fromElementModel((k) => _db[k] as MValue<Literal>).type).toBe(
      T.OUTSET
    );
  });
});

describe("Testing 'toElementModel' function", function () {
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
      spread: 0,
      tempSpread: 2,
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
    expect(toElementModel(model)).toEqual(result);
  });
});
