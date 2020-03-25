import { times, identity } from "underscore";
import {
  testGetterValidation,
  testSetterValidation
} from "visual/utils/model/utilities.test";
import {
  getBlur,
  getHex,
  getHorizontal,
  getOpacity,
  getPalette,
  getSpread,
  getType,
  getVertical,
  setBlur,
  setHex,
  setHorizontal,
  setOpacity,
  setPalette,
  setSpread,
  setType,
  setVertical
} from "./model";
import { palettes } from "visual/utils/color/toPalette";
import { types } from "visual/component/Options/types/dev/BoxShadow/entities/type";

describe("Testing 'getType' function", () => {
  const invalid = [undefined, null, 1, 2, "test", "test2"];
  testGetterValidation(getType, "type", types, invalid);
});

describe("Testing 'getOpacity' function", () => {
  const invalid = [undefined, null, "test", "test2", -1, -0.3];
  const valid = times(11, i => i * 0.1);
  testGetterValidation(getOpacity, "opacity", valid, invalid);
});

describe("Testing 'getPalette' function", () => {
  const invalid = [undefined, null, "test", "test2", -1, -0.3];
  testGetterValidation(getPalette, "palette", palettes, invalid);
});

describe("Testing 'getHex' function", () => {
  const valid = ["#123456", "#000000", "#444"];
  const invalid = [undefined, null, "test", "test2", -1, -0.3];
  testGetterValidation(getHex, "hex", valid, invalid);
});

describe("Testing 'getBlur' function", () => {
  const invalid = [undefined, null, "test", "test2", -1, -0.3];
  const valid = times(1000, identity);
  testGetterValidation(getBlur, "blur", valid, invalid);
});

describe("Testing 'getSpread' function", () => {
  const invalid = [undefined, null, "test", "test2"];
  const valid = [...times(10, identity), ...times(10, i => i * -1)];
  testGetterValidation(getSpread, "spread", valid, invalid);
});

describe("Testing 'getVertical' function", () => {
  const invalid = [undefined, null, "test", "test2"];
  const valid = times(1000, identity);
  testGetterValidation(getVertical, "vertical", valid, invalid);
});

describe("Testing 'getHorizontal' function", () => {
  const invalid = [undefined, null, "test", "test2"];
  const valid = times(1000, identity);
  testGetterValidation(getHorizontal, "horizontal", valid, invalid);
});

describe("Testing 'setType' function", function() {
  const invalid = [undefined, null, 1, 2, "test", "test2"];

  testSetterValidation(setType, getType, {}, types, invalid);
});

describe("Testing 'setOpacity' function", function() {
  const valid = times(11, i => i * 0.1);
  const invalid = [undefined, null, -1, -2, "test", "test2"];

  testSetterValidation(setOpacity, getOpacity, {}, valid, invalid);
});

describe("Testing 'setPalette' function", function() {
  const invalid = [undefined, null, -1, -2, "test", "test2"];
  const valid = ["", ...palettes];

  testSetterValidation(setPalette, getPalette, {}, valid, invalid);
});

describe("Testing 'setHex' function", function() {
  const invalid = [undefined, null, -1, -2, "test", "test2"];
  const valid = ["#333", "#567893"];

  testSetterValidation(setHex, getHex, {}, valid, invalid);
});

describe("Testing 'setBlur' function", function() {
  const valid = times(100, identity);
  const invalid = [undefined, null, "test", -2, -1];

  testSetterValidation(setBlur, getBlur, {}, valid, invalid);

  test("Setting the blur to 0 when spread is not 0, sets tempBlur 0 also", () => {
    expect(setBlur(0, { spread: 1, blur: 1, tempBlur: 2 })).toMatchObject({
      blur: 0,
      tempBlur: 0
    });
  });

  test("Setting the blur to 0 when spread is 0, do not set tempBlur", () => {
    expect(setBlur(0, { spread: 0, blur: 1, tempBlur: 2 })).toMatchObject({
      blur: 0,
      tempBlur: 2
    });
  });
});

describe("Testing 'setSpread' function", function() {
  const valid = [...times(15, identity), ...times(15, i => (i + 1) * -1)];
  const invalid = [undefined, null, "test"];

  testSetterValidation(setSpread, getSpread, {}, valid, invalid);

  test("Setting the spread to 0 when blur is not 0, sets tempSpread 0 also", () => {
    expect(setSpread(0, { spread: 1, blur: 1, tempSpread: 2 })).toMatchObject({
      spread: 0,
      tempSpread: 0
    });
  });

  test("Setting the spread to 0 when blur is 0, do not set tempSpread", () => {
    expect(setSpread(0, { blur: 0, spread: 1, tempSpread: 2 })).toMatchObject({
      spread: 0,
      tempSpread: 2
    });
  });
});

describe("Testing 'setVertical' function", function() {
  const valid = times(100, identity);
  const invalid = [undefined, null, "test"];

  testSetterValidation(setVertical, getVertical, {}, valid, invalid);
});

describe("Testing 'setHorizontal' function", function() {
  const valid = times(100, identity);
  const invalid = [undefined, null, "test"];

  testSetterValidation(setHorizontal, getHorizontal, {}, valid, invalid);
});
