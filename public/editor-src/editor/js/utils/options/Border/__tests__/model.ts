import { identity as id } from "es-toolkit";
import { times } from "es-toolkit/compat";
import * as Hex from "visual/utils/color/Hex";
import * as Opacity from "visual/utils/cssProps/opacity";
import { get } from "visual/utils/model";
import {
  testSetterTemp,
  testSetterValidation
} from "visual/utils/model/utilities.test";
import { capByPrefix } from "visual/utils/string";
import * as Palette from "../../ColorPicker/entities/palette";
import { defaultValue } from "../converters";
import { Value } from "../entities/Value";
import * as Style from "../entities/style";
import * as Width from "../entities/width";
import * as WidthType from "../entities/widthType";
import {
  getBottomWidth,
  getLeftWidth,
  getOpacity,
  getPalette,
  getRightWidth,
  getStyle,
  getTopWidth,
  getWidth,
  getWidthType,
  setBottomWidth,
  setHex,
  setLeftWidth,
  setOpacity,
  setPalette,
  setRightWidth,
  setStyle,
  setTopWidth,
  setWidth,
  setWidthType
} from "../model";

const hexs = ["#333", "#123456"].map(Hex.unsafe);
const opacity = times(11, (i) => i * 0.1).map(Opacity.unsafe);
const widths = times(100, id).map(Width.unsafe);

const filterEmpty = <T extends TS, TS>(e: T, vs: TS[]): Exclude<TS, T>[] =>
  vs.filter((i): i is Exclude<TS, T> => i !== e);
const tempGetter =
  <K extends keyof M, M>(key: K) =>
  (m: M): M[K] =>
    get(capByPrefix("temp", key as string) as keyof M, m) as M[K];

export const testBorderIsEmpty = (m: Value): void => {
  expect(getStyle(m)).toBe(Style.empty);
  expect(getOpacity(m)).toBe(Opacity.empty);
  expect(getPalette(m)).toBe(Palette.empty);
  expect(getWidth(m)).toBe(Width.empty);
  expect(getTopWidth(m)).toBe(Width.empty);
  expect(getRightWidth(m)).toBe(Width.empty);
  expect(getBottomWidth(m)).toBe(Width.empty);
  expect(getLeftWidth(m)).toBe(Width.empty);
};

describe("Testing 'getStyle' function", function () {
  Style.styles.forEach((style) =>
    test(`Expect ${style}`, () => {
      expect(getStyle({ ...defaultValue, style })).toBe(style);
    })
  );
});

describe("Testing 'setStyle' function", function () {
  testSetterValidation(setStyle, getStyle, defaultValue, Style.styles);
  testSetterTemp(
    setStyle,
    getStyle,
    tempGetter("style"),
    defaultValue,
    Style.empty,
    filterEmpty(Style.empty, Style.styles)
  );

  test("When style is empty, opacity, palette, width should be empty", () => {
    const model = setStyle(Style.empty, defaultValue);

    testBorderIsEmpty(model);
  });
});

describe("Testing 'setHex' function", function () {
  hexs.forEach((hex) =>
    test(`Expect ${hex}`, () => {
      expect(setHex(hex, { ...defaultValue, hex }).hex).toBe(hex);
    })
  );
});

describe("Testing 'setOpacity' function", function () {
  testSetterValidation(setOpacity, getOpacity, defaultValue, opacity);
  testSetterTemp(
    setOpacity,
    getOpacity,
    tempGetter<"opacity", Value>("opacity"),
    defaultValue,
    Opacity.empty,
    filterEmpty(Opacity.empty, opacity)
  );

  test("When opacity is empty, style, palette, width should be empty", () => {
    const model = setOpacity(Opacity.empty, defaultValue);

    testBorderIsEmpty(model);
  });
});

describe("Testing 'setPalette' function", function () {
  testSetterValidation(setPalette, getPalette, defaultValue, Palette.palettes);

  testSetterTemp(
    setPalette,
    getPalette,
    tempGetter<"palette", Value>("palette"),
    defaultValue,
    Palette.empty,
    filterEmpty(Palette.empty, Palette.palettes)
  );

  test("When palette is empty, style, opacity, width should be empty", () => {
    const model = setPalette(Palette.empty, defaultValue);

    testBorderIsEmpty(model);
  });
});

describe("Testing 'getWidthType' function", function () {
  WidthType.types.forEach((widthType) =>
    test(`Expect ${widthType}`, () => {
      expect(getWidthType({ ...defaultValue, widthType })).toBe(widthType);
    })
  );
});

describe("Testing 'setWidthType' function", function () {
  testSetterValidation(
    setWidthType,
    getWidthType,
    defaultValue,
    WidthType.types
  );
});

describe("Testing 'getWidth' function", function () {
  times(100, id)
    .map(Width.unsafe)
    .forEach((width) =>
      test(`Expect ${width}`, () => {
        expect(getWidth({ ...defaultValue, width })).toBe(width);
      })
    );
});

describe("Testing 'setWidth' function", function () {
  testSetterValidation(setWidth, getWidth, defaultValue, widths);

  test("When palette is width, style, opacity, palette should be empty", () => {
    const model = setPalette(Palette.empty, defaultValue);

    testBorderIsEmpty(model);
  });
});

describe("Testing 'getTopWidth' function", function () {
  times(100, id)
    .map(Width.unsafe)
    .forEach((topWidth) =>
      test(`Expect ${topWidth}`, () => {
        expect(getTopWidth({ ...defaultValue, topWidth })).toBe(topWidth);
      })
    );
});

describe("Testing 'setTopWidth' function", function () {
  testSetterValidation(
    setTopWidth,
    getTopWidth,
    { ...defaultValue, widthType: WidthType.UNGROUPED },
    widths
  );

  test("When palette is width, style, opacity, palette should be empty", () => {
    const model = setPalette(Palette.empty, defaultValue);

    testBorderIsEmpty(model);
  });
});

describe("Testing 'getRightWidth' function", function () {
  times(100, id)
    .map(Width.unsafe)
    .forEach((rightWidth) =>
      test(`Expect ${rightWidth}`, () => {
        expect(getRightWidth({ ...defaultValue, rightWidth })).toBe(rightWidth);
      })
    );

  test("When palette is width, style, opacity, palette should be empty", () => {
    const model = setPalette(Palette.empty, defaultValue);

    testBorderIsEmpty(model);
  });
});

describe("Testing 'setRightWidth' function", function () {
  testSetterValidation(
    setRightWidth,
    getRightWidth,
    { ...defaultValue, widthType: WidthType.UNGROUPED },
    widths
  );

  test("When palette is width, style, opacity, palette should be empty", () => {
    const model = setPalette(Palette.empty, defaultValue);

    testBorderIsEmpty(model);
  });
});

describe("Testing 'getBottomWidth' function", function () {
  times(100, id)
    .map(Width.unsafe)
    .forEach((bottomWidth) =>
      test(`Expect ${bottomWidth}`, () => {
        expect(getBottomWidth({ ...defaultValue, bottomWidth })).toBe(
          bottomWidth
        );
      })
    );

  test("When palette is width, style, opacity, palette should be empty", () => {
    const model = setPalette(Palette.empty, defaultValue);

    testBorderIsEmpty(model);
  });
});

describe("Testing 'setBottomWidth' function", function () {
  testSetterValidation(
    setBottomWidth,
    getBottomWidth,
    { ...defaultValue, widthType: WidthType.UNGROUPED },
    widths
  );

  test("When palette is width, style, opacity, palette should be empty", () => {
    const model = setPalette(Palette.empty, defaultValue);

    testBorderIsEmpty(model);
  });
});

describe("Testing 'getLeftWidth' function", function () {
  times(100, id)
    .map(Width.unsafe)
    .forEach((leftWidth) =>
      test(`Expect ${leftWidth}`, () => {
        expect(getLeftWidth({ ...defaultValue, leftWidth })).toBe(leftWidth);
      })
    );
});

describe("Testing 'setLeftWidth' function", function () {
  testSetterValidation(
    setLeftWidth,
    getLeftWidth,
    { ...defaultValue, widthType: WidthType.UNGROUPED },
    widths
  );

  test("When palette is empty, then width, style, opacity, palette should be empty", () => {
    const model = setPalette(Palette.empty, defaultValue);

    testBorderIsEmpty(model);
  });

  test("When value is higher then 0, set all edges values to value", () => {
    const r = {
      topWidth: Width.unsafe(2),
      rightWidth: Width.unsafe(2),
      bottomWidth: Width.unsafe(2),
      leftWidth: Width.unsafe(2)
    };

    expect(setWidth(Width.unsafe(2), defaultValue)).toMatchObject(r);
  });
});
