"use strict";

import { times, identity as id } from "underscore";
import {
  testGetterValidation,
  testSetterTemp,
  testSetterValidation
} from "visual/utils/model/utilities.test";
import { get } from "visual/utils/model";
import { capByPrefix } from "visual/utils/string";
import * as Opacity from "visual/utils/cssProps/opacity";
import * as Palette from "visual/component/Options/types/dev/ColorPicker/entities/palette";
import {
  getStyle,
  setStyle,
  getHex,
  setHex,
  getOpacity,
  setOpacity,
  getPalette,
  setPalette,
  getWidth,
  getTopWidth,
  getRightWidth,
  getBottomWidth,
  getLeftWidth,
  setWidth,
  setTopWidth,
  setRightWidth,
  setBottomWidth,
  setLeftWidth,
  getWidthType,
  setWidthType
} from "./model";
import * as Style from "./entities/style";
import * as Width from "./entities/width";
import * as WidthType from "./entities/widthType";

const invalidStyles = [undefined, null, "test", 123];
const invalidTypes = [undefined, null, "test", 1];
const hex = ["#333", "#123456"];
const invalidHex = [undefined, null, "test", 1];
const opacity = times(11, i => i * 0.1);
const invalidOpacity = [undefined, null, "test", -1];
const widths = times(100, id);
const invalidWidth = [undefined, null, "test"];
const invalidPalettes = [undefined, null, -1, -2, "test", "test2"];

const filterEmpty = (e, vs) => vs.filter(i => i !== Style.empty);
const tempGetter = (key, orElse) => m =>
  get(capByPrefix("temp", key), m, orElse);

export const testBorderIsEmpty = m => {
  expect(getStyle(m)).toBe(Style.empty);
  expect(getOpacity(m)).toBe(Opacity.empty);
  expect(getPalette(m)).toBe(Palette.empty);
  expect(getWidth(m)).toBe(Width.empty);
  expect(getTopWidth(m)).toBe(Width.empty);
  expect(getRightWidth(m)).toBe(Width.empty);
  expect(getBottomWidth(m)).toBe(Width.empty);
  expect(getLeftWidth(m)).toBe(Width.empty);
};

describe("Testing 'getStyle' function", function() {
  testGetterValidation(getStyle, "style", Style.styles, invalidStyles);
});

describe("Testing 'setStyle' function", function() {
  testSetterValidation(setStyle, getStyle, {}, Style.styles, invalidStyles);
  testSetterTemp(
    setStyle,
    getStyle,
    tempGetter("style", Style.empty),
    {},
    Style.empty,
    filterEmpty(Style.empty, Style.styles)
  );

  test("When style is empty, opacity, palette, width should be empty", () => {
    const model = setStyle(Style.empty, {});

    testBorderIsEmpty(model);
  });
});

describe("Testing 'setHex' function", function() {
  testSetterValidation(setHex, getHex, {}, hex, invalidHex);
});

describe("Testing 'setOpacity' function", function() {
  testSetterValidation(setOpacity, getOpacity, {}, opacity, invalidOpacity);
  testSetterTemp(
    setOpacity,
    getOpacity,
    tempGetter("opacity", Opacity.empty),
    {},
    Opacity.empty,
    filterEmpty(Opacity.empty, opacity)
  );

  test("When opacity is empty, style, palette, width should be empty", () => {
    const model = setOpacity(Opacity.empty, {});

    testBorderIsEmpty(model);
  });
});

describe("Testing 'setPalette' function", function() {
  testSetterValidation(
    setPalette,
    getPalette,
    {},
    Palette.palettes,
    invalidPalettes
  );

  testSetterTemp(
    setPalette,
    getPalette,
    tempGetter("palette", Palette.empty),
    {},
    Palette.empty,
    filterEmpty(Palette.empty, Palette.palettes)
  );

  test("When palette is empty, style, opacity, width should be empty", () => {
    const model = setPalette(Palette.empty, {});

    testBorderIsEmpty(model);
  });
});

describe("Testing 'getWidthType' function", function() {
  testGetterValidation(
    getWidthType,
    "widthType",
    WidthType.types,
    invalidTypes
  );
});

describe("Testing 'setWidthType' function", function() {
  testSetterValidation(
    setWidthType,
    getWidthType,
    {},
    WidthType.types,
    invalidTypes
  );
});

describe("Testing 'getWidth' function", function() {
  testGetterValidation(getWidth, "width", times(100, id), invalidWidth);
});

describe("Testing 'setWidth' function", function() {
  testSetterValidation(setWidth, getWidth, {}, widths, invalidWidth);

  test("When palette is width, style, opacity, palette should be empty", () => {
    const model = setPalette(Palette.empty, {});

    testBorderIsEmpty(model);
  });
});

describe("Testing 'getTopWidth' function", function() {
  testGetterValidation(getTopWidth, "topWidth", times(100, id), invalidWidth);
});

describe("Testing 'setTopWidth' function", function() {
  testSetterValidation(
    setTopWidth,
    getTopWidth,
    { widthType: WidthType.UNGROUPED },
    widths,
    invalidWidth
  );

  test("When palette is width, style, opacity, palette should be empty", () => {
    const model = setPalette(Palette.empty, {});

    testBorderIsEmpty(model);
  });
});

describe("Testing 'getRightWidth' function", function() {
  testGetterValidation(
    getRightWidth,
    "rightWidth",
    times(100, id),
    invalidWidth
  );

  test("When palette is width, style, opacity, palette should be empty", () => {
    const model = setPalette(Palette.empty, {});

    testBorderIsEmpty(model);
  });
});

describe("Testing 'setRightWidth' function", function() {
  testSetterValidation(
    setRightWidth,
    getRightWidth,
    { widthType: WidthType.UNGROUPED },
    widths,
    invalidWidth
  );

  test("When palette is width, style, opacity, palette should be empty", () => {
    const model = setPalette(Palette.empty, {});

    testBorderIsEmpty(model);
  });
});

describe("Testing 'getBottomWidth' function", function() {
  testGetterValidation(
    getBottomWidth,
    "bottomWidth",
    times(100, id),
    invalidWidth
  );

  test("When palette is width, style, opacity, palette should be empty", () => {
    const model = setPalette(Palette.empty, {});

    testBorderIsEmpty(model);
  });
});

describe("Testing 'setBottomWidth' function", function() {
  testSetterValidation(
    setBottomWidth,
    getBottomWidth,
    { widthType: WidthType.UNGROUPED },
    widths,
    invalidWidth
  );

  test("When palette is width, style, opacity, palette should be empty", () => {
    const model = setPalette(Palette.empty, {});

    testBorderIsEmpty(model);
  });
});

describe("Testing 'getLeftWidth' function", function() {
  testGetterValidation(getLeftWidth, "leftWidth", times(100, id), invalidWidth);
});

describe("Testing 'setLeftWidth' function", function() {
  testSetterValidation(
    setLeftWidth,
    getLeftWidth,
    { widthType: WidthType.UNGROUPED },
    widths,
    invalidWidth
  );

  test("When palette is empty, then width, style, opacity, palette should be empty", () => {
    const model = setPalette(Palette.empty, {});

    testBorderIsEmpty(model);
  });

  test("When value is higher then 0, set all edges values to value", () => {
    const r = {
      topWidth: 2,
      rightWidth: 2,
      bottomWidth: 2,
      leftWidth: 2
    };

    expect(setWidth(2, {})).toMatchObject(r);
  });
});
