import _ from "underscore";
import {
  getHex,
  getOpacity,
  getPalette,
  setHex,
  setOpacity,
  setPalette
} from "visual/component/Options/types/dev/ColorPicker/model";
import { palettes } from "visual/utils/color/Palette";
import { Value } from "./entities/Value";
import { Black } from "visual/utils/color/Hex";
import * as Opacity from "visual/utils/cssProps/opacity";
import * as Hex from "visual/utils/color/Hex";

const model: Value = {
  hex: Black,
  opacity: Opacity.unsafe(0.5),
  tempOpacity: Opacity.unsafe(0.8),
  palette: "color1",
  tempPalette: "color2"
};

describe("Testing 'getOpacity' function", function() {
  test("Return 0.5", () => {
    expect(getOpacity({ ...model, opacity: Opacity.unsafe(0.5) })).toBe(0.5);
  });
});

describe("Testing 'setOpacity' function", function() {
  test("If current value is equal to new one, return original model", () => {
    expect(setOpacity(Opacity.unsafe(0.5), model)).toBe(model);
  });

  test("If current value is different to new one, update new opacity", () => {
    _.times(11, i =>
      expect(setOpacity(Opacity.unsafe(i * 0.1), model).opacity).toEqual(
        i * 0.1
      )
    );
  });

  test("Opacity value should no affect hex value", () => {
    _.times(10, i =>
      expect(setOpacity(Opacity.unsafe(i * 0.1), model).hex).toBe(model.hex)
    );
  });

  test("If opacity == 0, palette value is set to empty", () => {
    expect(setOpacity(Opacity.empty, model).palette).toBe("");
  });

  test("If opacity == 0, tempPalette takes current palette value", () => {
    expect(setOpacity(Opacity.empty, model).tempPalette).toBe(model.palette);
  });

  test("If opacity == 0, tempOpacity takes current opacity value", () => {
    expect(setOpacity(Opacity.empty, model).tempOpacity).toBe(model.opacity);
  });

  test("If opacity > 0 and palette == '', palette takes temptPalette value", () => {
    expect(
      setOpacity(Opacity.unsafe(0.6), { ...model, palette: "" }).palette
    ).toBe(model.tempPalette);
  });
});

describe("Testing 'getHex' function", function() {
  test("Return hex value if it is a valid HEX string", () => {
    expect(getHex({ ...model, hex: Black })).toBe(Black);
  });
});

describe("Testing 'setHex' function", function() {
  test("If value is equal to current hex, return the original model", () => {
    expect(setHex(model.hex, model)).toBe(model);
  });

  test("If value is different to current hex, update hex", () => {
    ["#333333", "#456789", "#333"]
      .map(Hex.unsafe)
      .map(i => expect(setHex(i, model).hex).toEqual(i));
  });

  test("If opacity == 0, take tempOpacity value", () => {
    expect(
      setHex(Hex.unsafe("#456789"), { ...model, opacity: Opacity.empty })
        .opacity
    ).toBe(model.tempOpacity);
  });

  test("If opacity != 0, it should keep the value", () => {
    expect(setHex(Hex.unsafe("#456789"), model).opacity).toBe(model.opacity);
  });

  test("If palette has value, set to ''", () => {
    expect(setHex(Hex.unsafe("#456789"), model).palette).toBe("");
  });

  test("If palette has no value, keep the value", () => {
    expect(
      setHex(Hex.unsafe("#456789"), { ...model, palette: "" }).palette
    ).toBe("");
  });
});

describe("Testing 'getPalette' function", function() {
  test("Return the palette if it is a valid palette value", () => {
    expect(getPalette({ ...model, palette: "color7" })).toBe("color7");
  });

  palettes.forEach(palette =>
    test(`Expect '${palette}'`, () => {
      expect(getPalette({ ...model, palette })).toBe(palette);
    })
  );
});

describe("Testing 'setPalette' function", function() {
  test("If the value is equal to current palette, return the original model", () => {
    expect(setPalette(model.palette, model)).toBe(model);
  });

  test("If the value is different to current palette, update palette value", () => {
    palettes.map(v => expect(setPalette(v, model).palette).toBe(v));
  });

  test("If value == '', tempPalette takes palette current value", () => {
    expect(setPalette("", model).tempPalette).toBe(model.palette);
  });

  test("If value != '', tempPalette should remain the same", () => {
    expect(setPalette("color4", model).tempPalette).toBe(model.tempPalette);
  });

  test("If opacity == 0, opacity takes tempOpacity value", () => {
    expect(
      setPalette("color4", { ...model, opacity: Opacity.empty }).opacity
    ).toBe(model.tempOpacity);
  });

  test("If opacity != 0, it should remain the same", () => {
    expect(setPalette("color4", model).opacity).toBe(model.opacity);
  });
});
