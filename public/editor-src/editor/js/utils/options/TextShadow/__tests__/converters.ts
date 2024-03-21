import { fromElementModel, toElementModel } from "../converters";
import { NoEmptyBlur } from "../types/NoEmptyBlur";
import { NoEmptyOpacity } from "../types/NoEmptyOpacity";
import { Empty, NoEmpty } from "../types/Value";

describe("Testing 'toElementModel' function", () => {
  test("Test empty value", () => {
    const empty: Empty = {
      blur: 0,
      hex: "#000000",
      opacity: 0,
      palette: undefined,
      horizontal: 0,
      vertical: 0,
      tempOpacity: 0.5 as NoEmptyOpacity,
      tempHorizontal: 1,
      tempVertical: 1,
      tempBlur: 1 as NoEmptyBlur,
      tempPalette: "color2"
    };

    expect(toElementModel(empty)).toStrictEqual({
      blur: 0,
      colorHex: "#000000",
      colorOpacity: 0,
      colorPalette: undefined,
      horizontal: 0,
      vertical: 0
    });
  });

  test("Test with value", () => {
    const withValue: NoEmpty = {
      blur: 1 as NoEmptyBlur,
      hex: "#000000",
      opacity: 0.5 as NoEmptyOpacity,
      horizontal: 3,
      vertical: 3,
      palette: "color3"
    };
    expect(toElementModel(withValue)).toStrictEqual({
      blur: 1,
      colorHex: "#000000",
      colorOpacity: 0.5,
      colorPalette: "color3",
      horizontal: 3,
      vertical: 3,
      tempColorOpacity: 0.5,
      tempHorizontal: 3,
      tempVertical: 3,
      tempBlur: 1,
      tempColorPalette: "color3"
    });
  });
});

describe("Testing 'fromElementModel' function", () => {
  test("Test empty value", () => {
    const model: Record<string, number | string | undefined> = {
      blur: 0,
      colorHex: "#000000",
      colorOpacity: 0,
      colorPalette: undefined,
      horizontal: 0,
      vertical: 0,
      tempBlur: 1,
      tempColorOpacity: 0.5,
      tempColorPalette: "color2",
      tempHorizontal: 1,
      tempVertical: 1
    };

    expect(fromElementModel((k) => model[k])).toStrictEqual({
      blur: 0,
      hex: "#000000",
      opacity: 0,
      horizontal: 0,
      vertical: 0,
      palette: undefined,
      tempOpacity: 0.5 as NoEmptyOpacity,
      tempHorizontal: 1,
      tempVertical: 1,
      tempBlur: 1 as NoEmptyBlur,
      tempPalette: "color2"
    });
  });

  test("Test with value", () => {
    const model: Record<string, number | string | undefined> = {
      blur: 1,
      colorHex: "#000000",
      colorOpacity: 0.5,
      colorPalette: "color4",
      horizontal: 2,
      vertical: 2,
      tempBlur: 1,
      tempColorOpacity: 0.5,
      tempColorPalette: "color4",
      tempHorizontal: 2,
      tempVertical: 2
    };
    expect(fromElementModel((k) => model[k])).toStrictEqual({
      blur: 1,
      hex: "#000000",
      opacity: 0.5,
      palette: "color4",
      horizontal: 2,
      vertical: 2
    });
  });
});
