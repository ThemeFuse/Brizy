import _ from "underscore";
import {
  getHex,
  getOpacity,
  getPalette,
  setHex,
  setOpacity,
  setPalette
} from "visual/component/Options/types/dev/ColorPicker/model";
import { palettes } from "visual/utils/color/toPalette";
import {
  testGetter,
  testGetterValidation,
  testSetterValidation
} from "visual/utils/model/utilities.test";

const model = {
  hex: "#333333",
  opacity: 0.5,
  tempOpacity: 0.8,
  palette: "color1",
  tempPalette: "color2"
};
const validOpacity = _.times(11, i => i * 0.1);
const invalidOpacity = [undefined, null, "", {}, 1.1, -0.3];

describe("Testing 'getOpacity' function", function() {
  testGetterValidation(getOpacity, "opacity", validOpacity, invalidOpacity);

  test("Return 0.5", () => {
    expect(getOpacity({ opacity: 0.5 }, 0.7)).toBe(0.5);
  });

  test("Return default value if opacity is not a number", () => {
    expect(getOpacity({}, 0.7)).toBe(0.7);
    expect(getOpacity({ opacity: "test" }, 0.7)).toBe(0.7);
  });

  test("Return default value if opacity is lower then 0", () => {
    expect(getOpacity({ opacity: -3 }, 0.7)).toBe(0.7);
  });

  test("Return default value if opacity is higher then 1", () => {
    expect(getOpacity({ opacity: 3 }, 0.7)).toBe(0.7);
  });
});

describe("Testing 'setOpacity' function", function() {
  testSetterValidation(
    setOpacity,
    getOpacity,
    {},
    validOpacity,
    invalidOpacity
  );

  test("If the value is not a valid opacity return the original model", () => {
    [undefined, null, -3, 1.1].map(v =>
      expect(setOpacity(v, model)).toBe(model)
    );
  });

  test("If current value is equal to new one, return original model", () => {
    expect(setOpacity(0.5, model)).toBe(model);
  });

  test("If current value is different to new one, update new opacity", () => {
    _.times(11, i =>
      expect(setOpacity(i * 0.1, model).opacity).toEqual(i * 0.1)
    );
  });

  test("Opacity value should no affect hex value", () => {
    _.times(10, i => expect(setOpacity(i * 0.1, model).hex).toBe(model.hex));
  });

  test("If opacity == 0, palette value is set to empty", () => {
    expect(setOpacity(0, model).palette).toBe("");
  });

  test("If opacity == 0, tempPalette takes current palette value", () => {
    expect(setOpacity(0, model).tempPalette).toBe(model.palette);
  });

  test("If opacity == 0, tempOpacity takes current opacity value", () => {
    expect(setOpacity(0, model).tempOpacity).toBe(model.opacity);
  });

  test("If opacity > 0 and palette == '', palette takes temptPalette value", () => {
    expect(setOpacity(0.6, { ...model, palette: "" }).palette).toBe(
      model.tempPalette
    );
  });
});

describe("Testing 'getHex' function", function() {
  testGetterValidation(
    getHex,
    "hex",
    ["#333", "#123456"],
    [undefined, null, "test", 1]
  );

  test("Return hex value if it is a valid HEX string", () => {
    expect(getHex({ hex: "#333333" }, "#111111")).toBe("#333333");
  });

  test("Return orElse if hex value is not a valid HEX string", () => {
    [undefined, null, "123", 3, "#zzzz"].map(v =>
      expect(getHex({ hex: "v" }, "#111111")).toBe("#111111")
    );
  });
});

describe("Testing 'setHex' function", function() {
  testSetterValidation(
    setHex,
    getHex,
    {},
    ["#333", "#123456"],
    [undefined, null, "test", 1]
  );

  test("If value is not a valid hex, return the original model", () => {
    [undefined, null, "123", 3, "#zzzz"].map(v =>
      expect(setHex(v, model)).toBe(model)
    );
  });

  test("If value is equal to current hex, return the original model", () => {
    expect(setHex(model.hex, model)).toBe(model);
  });

  test("If value is different to current hex, update hex", () => {
    ["#333333", "#456789", "#333"].map(i =>
      expect(setHex(i, model).hex).toEqual(i)
    );
  });

  test("If opacity == 0, take tempOpacity value", () => {
    expect(setHex("#456789", { ...model, opacity: 0 }).opacity).toBe(
      model.tempOpacity
    );
  });

  test("If opacity != 0, it should keep the value", () => {
    expect(setHex("#456789", model).opacity).toBe(model.opacity);
  });

  test("If palette has value, set to ''", () => {
    expect(setHex("#456789", model).palette).toBe("");
  });

  test("If palette has no value, keep the value", () => {
    expect(setHex("#456789", { ...model, palette: "" }).palette).toBe("");
  });
});

describe("Testing 'getPalette' function", function() {
  testGetterValidation(
    getPalette,
    "palette",
    ["", ...palettes],
    [undefined, null, "test", 1]
  );

  test("Return the palette if it is a valid palette value", () => {
    expect(getPalette({ palette: "color7" }, "color3")).toBe("color7");
  });

  test("Return default value if the palette value is not valid", () => {
    [undefined, null, 3, "test3", {}].map(palette =>
      expect(getPalette({ palette }, "color3")).toBe("color3")
    );
  });
});

describe("Testing 'setPalette' function", function() {
  testSetterValidation(
    setPalette,
    getPalette,
    {},
    ["", ...palettes],
    [undefined, null, "test", 1]
  );
  test("If the value is not a valid palette, return the original model", () => {
    [undefined, null, "test-3"].map(v =>
      expect(setPalette(v, model)).toBe(model)
    );
  });

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
    expect(setPalette("#333333", model).tempPalette).toBe(model.tempPalette);
  });

  test("If opacity == 0, opacity takes tempOpacity value", () => {
    expect(setPalette("color4", { ...model, opacity: 0 }).opacity).toBe(
      model.tempOpacity
    );
  });

  test("If opacity != 0, it should remain the same", () => {
    expect(setPalette("color4", model).opacity).toBe(model.opacity);
  });
});
