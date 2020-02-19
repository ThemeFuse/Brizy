import { times, identity as id } from "underscore";
import * as Opacity from "visual/utils/cssProps/opacity";
import * as Palette from "visual/component/Options/types/dev/ColorPicker/entities/palette";
import {
  testGetterValidation,
  testModelToggle,
  testSetterValidation
} from "visual/utils/model/utilities.test";
import * as Width from "./entities/width";
import * as WidthType from "./entities/widthType";
import * as Style from "./entities/style";
import {
  _getWidth,
  _setWidth,
  fromElementModel,
  isEmptyWidth,
  toElementModel,
  toggleStyle,
  toggleWidth
} from "./utils";
import {
  getBottomWidth,
  getLeftWidth,
  getRightWidth,
  getStyle,
  getTopWidth,
  getWidth,
  setStyle
} from "visual/component/Options/types/dev/Border/model";
import { COLOR3 } from "visual/utils/color/toPalette";
import { testBorderIsEmpty } from "visual/component/Options/types/dev/Border/model.test";

describe("Testing 'isEmptyWidth' function", function() {
  test("If width type is grouped and width empty, return true", () => {
    const m = {
      widthType: WidthType.GROUPED,
      width: Width.empty
    };
    expect(isEmptyWidth(m)).toBe(true);
  });

  test("If width type is grouped and width not empty, return false", () => {
    const m = {
      widthType: WidthType.GROUPED,
      width: 1
    };
    expect(isEmptyWidth(m)).toBe(false);
  });

  test("If width type is ungrouped and all edges widths are empty, return true", () => {
    const m = {
      widthType: WidthType.GROUPED,
      topWidth: 0,
      rightWidth: 0,
      bottomWidth: 0,
      leftWidth: 0
    };
    expect(isEmptyWidth(m)).toBe(true);
  });

  test("If width type is ungrouped and at least one edge is not empty, return true", () => {
    const m = {
      widthType: WidthType.UNGROUPED,
      topWidth: 0,
      rightWidth: 0,
      bottomWidth: 0,
      leftWidth: 9
    };
    expect(isEmptyWidth(m)).toBe(false);
  });
});

describe("Testing '_getWidth' function", function() {
  const valid = times(100, id);
  const invalid = [undefined, null, -1, -4];

  ["width", "test", "otherKey"].map(k => {
    testGetterValidation(_getWidth.bind(null, k), k, valid, invalid);
  });
});

describe("Testing '_setWidth' function", function() {
  const valid = times(100, id);
  const invalid = [undefined, null, -1, -4];

  ["width", "test", "otherKey"].map(k => {
    testSetterValidation(
      _setWidth.bind(null, k),
      _getWidth.bind(null, k),
      {},
      valid,
      invalid
    );

    test("When one key is set, other keys temp value becomes their current value, even if it is empty", () => {
      const m = {
        widthType: WidthType.UNGROUPED,
        topWidth: 0,
        tempTopWidth: 4,
        rightWidth: 0,
        tempRightWidth: 6,
        bottomWidth: 0,
        tempBottomWidth: 8,
        leftWidth: 9,
        tempLeftWidth: 10
      };

      const r = {
        widthType: WidthType.UNGROUPED,
        topWidth: 0,
        tempTopWidth: 0,
        rightWidth: 0,
        tempRightWidth: 0,
        bottomWidth: 0,
        tempBottomWidth: 0,
        leftWidth: 9,
        tempLeftWidth: 9
      };

      valid.map(v => expect(_setWidth(k, v, m)).toMatchObject(r));
    });

    test("When width is empty, opacity, palette, style should be empty", () => {
      const model = _setWidth(k, Width.empty, {});

      testBorderIsEmpty(model);
    });
  });
});

describe("Testing 'toggleStyle' function", function() {
  const m = {
    style: Style.empty,
    tempStyle: Style.DOTTED,
    width: 0,
    tempWidth: 2,
    topWidth: 0,
    tempTopWidth: 4,
    rightWidth: 0,
    tempRightWidth: 6,
    bottomWidth: 0,
    tempBottomWidth: 8,
    leftWidth: 0,
    tempLeftWidth: 10
  };
  const getters = [
    [getStyle, Style.empty, Style.DOTTED],
    [getWidth, Width.empty, 2],
    [getTopWidth, Width.empty, 4],
    [getRightWidth, Width.empty, 6],
    [getBottomWidth, Width.empty, 8],
    [getLeftWidth, Width.empty, 10]
  ];

  testModelToggle(toggleStyle, m, getters);
});

describe("Testing 'toggleWidth' function", function() {
  const m = {
    width: 0,
    tempWidth: 2,
    topWidth: 0,
    tempTopWidth: 4,
    rightWidth: 0,
    tempRightWidth: 6,
    bottomWidth: 0,
    tempBottomWidth: 8,
    leftWidth: 0,
    tempLeftWidth: 10
  };
  const getters = [
    [getWidth, Width.empty, 2],
    [getTopWidth, Width.empty, 4],
    [getRightWidth, Width.empty, 6],
    [getBottomWidth, Width.empty, 8],
    [getLeftWidth, Width.empty, 10]
  ];

  testModelToggle(toggleWidth, m, getters);
});

describe("Testing 'fromElementModel' function", function() {
  test("If the element model key is missing or is not valid, use use empty value for default", () => {
    const m = {};
    const r = {
      style: Style.empty,
      tempStyle: Style.SOLID,
      hex: "",
      opacity: Opacity.empty,
      tempOpacity: 1,
      palette: Palette.empty,
      tempPalette: Palette.empty,
      widthType: WidthType.empty,
      width: Width.empty,
      tempWidth: 1,
      topWidth: Width.empty,
      tempTopWidth: 1,
      rightWidth: Width.empty,
      tempRightWidth: 1,
      bottomWidth: Width.empty,
      tempBottomWidth: 1,
      leftWidth: Width.empty,
      tempLeftWidth: 1
    };

    expect(fromElementModel(k => m[k])).toMatchObject(r);
  });

  test("If key exists and value is valid, use key value", () => {
    const m = {
      style: Style.DOTTED,
      tempStyle: Style.DOTTED,
      colorHex: "#555555",
      colorOpacity: 0.1,
      tempColorOpacity: 0.1,
      colorPalette: COLOR3,
      tempColorPalette: COLOR3,
      widthType: WidthType.UNGROUPED,
      width: 1,
      tempWidth: 1,
      topWidth: 1,
      tempTopWidth: 1,
      rightWidth: 1,
      tempRightWidth: 1,
      bottomWidth: 1,
      tempBottomWidth: 1,
      leftWidth: 1,
      tempLeftWidth: 1
    };
    const {
      colorHex,
      colorOpacity,
      tempColorOpacity,
      colorPalette,
      tempColorPalette,
      ...other
    } = m;

    const r = {
      ...other,
      hex: colorHex,
      opacity: colorOpacity,
      tempOpacity: tempColorOpacity,
      palette: colorPalette,
      tempPalette: tempColorPalette
    };

    expect(fromElementModel(k => m[k])).toMatchObject(r);
  });
});

describe("Testing 'toElementModel' function", function() {
  test("If the element model key is missing or is not valid, use use empty value for default", () => {
    const m = {};
    const r = {
      style: Style.empty,
      tempStyle: Style.SOLID,
      colorHex: "",
      colorOpacity: Opacity.empty,
      tempColorOpacity: 1,
      colorPalette: Palette.empty,
      tempColorPalette: Palette.empty,
      widthType: WidthType.empty,
      width: Width.empty,
      tempWidth: 1,
      topWidth: Width.empty,
      tempTopWidth: 1,
      rightWidth: Width.empty,
      tempRightWidth: 1,
      bottomWidth: Width.empty,
      tempBottomWidth: 1,
      leftWidth: Width.empty,
      tempLeftWidth: 1
    };

    expect(toElementModel(m)).toMatchObject(r);
  });

  test("If key exists and value is valid, use key value", () => {
    const m = {
      style: Style.DOTTED,
      tempStyle: Style.DOTTED,
      hex: "#555555",
      opacity: 0.1,
      tempOpacity: 0.1,
      palette: COLOR3,
      tempPalette: COLOR3,
      widthType: WidthType.UNGROUPED,
      width: 1,
      tempWidth: 1,
      topWidth: 1,
      tempTopWidth: 1,
      rightWidth: 1,
      tempRightWidth: 1,
      bottomWidth: 1,
      tempBottomWidth: 1,
      leftWidth: 1,
      tempLeftWidth: 1
    };
    const { hex, opacity, tempOpacity, palette, tempPalette, ...other } = m;

    const r = {
      ...other,
      colorHex: hex,
      colorOpacity: opacity,
      tempColorOpacity: tempOpacity,
      colorPalette: palette,
      tempColorPalette: tempPalette
    };

    expect(toElementModel(m)).toMatchObject(r);
  });
});
