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
import * as Hex from "visual/utils/color/Hex";
import { Value } from "visual/component/Options/types/dev/Border/entities/Value";
import { DEFAULT_VALUE } from "visual/component/Options/types/dev/Border/utils";

const hexs = ["#333", "#123456"].map(Hex.unsafe);
const opacity = times(11, i => i * 0.1).map(Opacity.unsafe);
const widths = times(100, id).map(Width.unsafe);

const filterEmpty = <T extends TS, TS>(e: T, vs: TS[]): Exclude<TS, T>[] =>
  vs.filter((i): i is Exclude<TS, T> => i !== e);
const tempGetter = <K extends keyof M, M>(key: K) => (m: M): M[K] =>
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

describe("Testing 'getStyle' function", function() {
  Style.styles.forEach(style =>
    test(`Expect ${style}`, () => {
      expect(getStyle({ ...DEFAULT_VALUE, style })).toBe(style);
    })
  );
});

describe("Testing 'setStyle' function", function() {
  testSetterValidation(setStyle, getStyle, DEFAULT_VALUE, Style.styles);
  testSetterTemp(
    setStyle,
    getStyle,
    tempGetter("style"),
    DEFAULT_VALUE,
    Style.empty,
    filterEmpty(Style.empty, Style.styles)
  );

  test("When style is empty, opacity, palette, width should be empty", () => {
    const model = setStyle(Style.empty, DEFAULT_VALUE);

    testBorderIsEmpty(model);
  });
});

describe("Testing 'setHex' function", function() {
  hexs.forEach(hex =>
    test(`Expect ${hex}`, () => {
      expect(setHex(hex, { ...DEFAULT_VALUE, hex }).hex).toBe(hex);
    })
  );
});

describe("Testing 'setOpacity' function", function() {
  testSetterValidation(setOpacity, getOpacity, DEFAULT_VALUE, opacity);
  testSetterTemp(
    setOpacity,
    getOpacity,
    tempGetter<"opacity", Value>("opacity"),
    DEFAULT_VALUE,
    Opacity.empty,
    filterEmpty(Opacity.empty, opacity)
  );

  test("When opacity is empty, style, palette, width should be empty", () => {
    const model = setOpacity(Opacity.empty, DEFAULT_VALUE);

    testBorderIsEmpty(model);
  });
});

describe("Testing 'setPalette' function", function() {
  testSetterValidation(setPalette, getPalette, DEFAULT_VALUE, Palette.palettes);

  testSetterTemp(
    setPalette,
    getPalette,
    tempGetter<"palette", Value>("palette"),
    DEFAULT_VALUE,
    Palette.empty,
    filterEmpty(Palette.empty, Palette.palettes)
  );

  test("When palette is empty, style, opacity, width should be empty", () => {
    const model = setPalette(Palette.empty, DEFAULT_VALUE);

    testBorderIsEmpty(model);
  });
});

describe("Testing 'getWidthType' function", function() {
  WidthType.types.forEach(widthType =>
    test(`Expect ${widthType}`, () => {
      expect(getWidthType({ ...DEFAULT_VALUE, widthType })).toBe(widthType);
    })
  );
});

describe("Testing 'setWidthType' function", function() {
  testSetterValidation(
    setWidthType,
    getWidthType,
    DEFAULT_VALUE,
    WidthType.types
  );
});

describe("Testing 'getWidth' function", function() {
  times(100, id)
    .map(Width.unsafe)
    .forEach(width =>
      test(`Expect ${width}`, () => {
        expect(getWidth({ ...DEFAULT_VALUE, width })).toBe(width);
      })
    );
});

describe("Testing 'setWidth' function", function() {
  testSetterValidation(setWidth, getWidth, DEFAULT_VALUE, widths);

  test("When palette is width, style, opacity, palette should be empty", () => {
    const model = setPalette(Palette.empty, DEFAULT_VALUE);

    testBorderIsEmpty(model);
  });
});

describe("Testing 'getTopWidth' function", function() {
  times(100, id)
    .map(Width.unsafe)
    .forEach(topWidth =>
      test(`Expect ${topWidth}`, () => {
        expect(getTopWidth({ ...DEFAULT_VALUE, topWidth })).toBe(topWidth);
      })
    );
});

describe("Testing 'setTopWidth' function", function() {
  testSetterValidation(
    setTopWidth,
    getTopWidth,
    { ...DEFAULT_VALUE, widthType: WidthType.UNGROUPED },
    widths
  );

  test("When palette is width, style, opacity, palette should be empty", () => {
    const model = setPalette(Palette.empty, DEFAULT_VALUE);

    testBorderIsEmpty(model);
  });
});

describe("Testing 'getRightWidth' function", function() {
  times(100, id)
    .map(Width.unsafe)
    .forEach(rightWidth =>
      test(`Expect ${rightWidth}`, () => {
        expect(getRightWidth({ ...DEFAULT_VALUE, rightWidth })).toBe(
          rightWidth
        );
      })
    );

  test("When palette is width, style, opacity, palette should be empty", () => {
    const model = setPalette(Palette.empty, DEFAULT_VALUE);

    testBorderIsEmpty(model);
  });
});

describe("Testing 'setRightWidth' function", function() {
  testSetterValidation(
    setRightWidth,
    getRightWidth,
    { ...DEFAULT_VALUE, widthType: WidthType.UNGROUPED },
    widths
  );

  test("When palette is width, style, opacity, palette should be empty", () => {
    const model = setPalette(Palette.empty, DEFAULT_VALUE);

    testBorderIsEmpty(model);
  });
});

describe("Testing 'getBottomWidth' function", function() {
  times(100, id)
    .map(Width.unsafe)
    .forEach(bottomWidth =>
      test(`Expect ${bottomWidth}`, () => {
        expect(getBottomWidth({ ...DEFAULT_VALUE, bottomWidth })).toBe(
          bottomWidth
        );
      })
    );

  test("When palette is width, style, opacity, palette should be empty", () => {
    const model = setPalette(Palette.empty, DEFAULT_VALUE);

    testBorderIsEmpty(model);
  });
});

describe("Testing 'setBottomWidth' function", function() {
  testSetterValidation(
    setBottomWidth,
    getBottomWidth,
    { ...DEFAULT_VALUE, widthType: WidthType.UNGROUPED },
    widths
  );

  test("When palette is width, style, opacity, palette should be empty", () => {
    const model = setPalette(Palette.empty, DEFAULT_VALUE);

    testBorderIsEmpty(model);
  });
});

describe("Testing 'getLeftWidth' function", function() {
  times(100, id)
    .map(Width.unsafe)
    .forEach(leftWidth =>
      test(`Expect ${leftWidth}`, () => {
        expect(getLeftWidth({ ...DEFAULT_VALUE, leftWidth })).toBe(leftWidth);
      })
    );
});

describe("Testing 'setLeftWidth' function", function() {
  testSetterValidation(
    setLeftWidth,
    getLeftWidth,
    { ...DEFAULT_VALUE, widthType: WidthType.UNGROUPED },
    widths
  );

  test("When palette is empty, then width, style, opacity, palette should be empty", () => {
    const model = setPalette(Palette.empty, DEFAULT_VALUE);

    testBorderIsEmpty(model);
  });

  test("When value is higher then 0, set all edges values to value", () => {
    const r = {
      topWidth: Width.unsafe(2),
      rightWidth: Width.unsafe(2),
      bottomWidth: Width.unsafe(2),
      leftWidth: Width.unsafe(2)
    };

    expect(setWidth(Width.unsafe(2), DEFAULT_VALUE)).toMatchObject(r);
  });
});
