import { ConfigCommon } from "visual/global/Config/types/configs/ConfigCommon";
import { palettes } from "visual/utils/color/Palette";
import { addPaletteVarsToModel } from "../Palette";

describe("Testing 'palettes' constant", function () {
  test("Should be: ['color1', 'color2', 'color3', 'color4', 'color5', 'color6', 'color7', 'color8']", () => {
    const ps = [
      "color1",
      "color2",
      "color3",
      "color4",
      "color5",
      "color6",
      "color7",
      "color8"
    ];

    expect(palettes).toEqual(ps);
  });
});

// Minimal config stub; actual fields are irrelevant due to the mock
const mockConfig = {} as ConfigCommon;

describe("addPaletteVarsToModel", () => {
  test("returns input when model is not an object", () => {
    const inputs = [null, undefined, "str", 0, true];
    inputs.forEach((input) => {
      const result = addPaletteVarsToModel(input, mockConfig);
      expect(result).toBe(input);
    });
  });

  test("adds palette var key for string palette fields", () => {
    const model = {
      colorPalette: "color3",
      somethingElse: "value"
    };

    const result = addPaletteVarsToModel(model, mockConfig);

    expect(result).toEqual({
      colorPalette: "color3",
      somethingElse: "value",
      colorPaletteVar: "--brz-global-color3"
    });
  });

  test("sets palette var to null for empty string values", () => {
    const model = {
      borderPalette: "",
      another: 123
    };

    const result = addPaletteVarsToModel(model, mockConfig) as Record<
      string,
      unknown
    >;
    expect(result.borderPaletteVar).toBeNull();
    expect(result.borderPalette).toBe("");
    expect(result.another).toBe(123);
  });

  test("ignores non-string palette values", () => {
    const model = {
      fillPalette: { id: "color2" }
    };

    const result = addPaletteVarsToModel(model, mockConfig) as Record<
      string,
      unknown
    >;
    expect(result.fillPaletteVar).toBeUndefined();
  });

  test("does not mutate the original model object", () => {
    const model = {
      backgroundPalette: "color5"
    };

    const copyBefore = { ...model };
    const result = addPaletteVarsToModel(model, mockConfig);

    // original untouched
    expect(model).toEqual(copyBefore);
    // new object contains derived var
    expect(result).toEqual({
      backgroundPalette: "color5",
      backgroundPaletteVar: "--brz-global-color5"
    });
  });

  test("only processes keys containing 'palette'", () => {
    const model = {
      textColor: "color1",
      textColorPalette: "color1"
    };

    const result = addPaletteVarsToModel(model, mockConfig) as Record<
      string,
      unknown
    >;
    expect(result.textColorVar).toBeUndefined();
    expect(result.textColorPaletteVar).toBe("--brz-global-color1");
  });

  test("does NOT process lowercase 'colorpalette' (no camel-case)", () => {
    const model = {
      colorpalette: "color2"
    } as Record<string, string>;

    const result = addPaletteVarsToModel(model, mockConfig) as Record<
      string,
      unknown
    >;
    expect(result.colorpaletteVar).toBeUndefined();
  });

  test("does NOT process 'backgroundPALETTE' (wrong casing)", () => {
    const model = {
      backgroundPALETTE: "color4"
    } as Record<string, string>;

    const result = addPaletteVarsToModel(model, mockConfig) as Record<
      string,
      unknown
    >;
    expect(result.backgroundPALETTEVar).toBeUndefined();
  });

  test("processes exact 'palette' key (lowercase)", () => {
    const model = {
      palette: "color6"
    } as Record<string, string>;

    const result = addPaletteVarsToModel(model, mockConfig) as Record<
      string,
      unknown
    >;
    expect(result.paletteVar).toBe("--brz-global-color6");
  });
});
