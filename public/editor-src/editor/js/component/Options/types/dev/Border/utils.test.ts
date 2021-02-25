import { times } from "underscore";
import * as Opacity from "visual/utils/cssProps/opacity";
import * as Palette from "visual/component/Options/types/dev/ColorPicker/entities/palette";
import * as Width from "./entities/width";
import * as WidthType from "./entities/widthType";
import * as Style from "./entities/style";
import {
  _setWidthEdge,
  fromElementModel,
  getStyleObject,
  isEmptyWidth,
  toElementModel,
  DEFAULT_VALUE
} from "./utils";
import { getWidth } from "visual/component/Options/types/dev/Border/model";
import { COLOR3 } from "visual/utils/color/Palette";
import { capByPrefix } from "visual/utils/string";
import * as BorderStyle from "./entities/style";
import { t } from "visual/utils/i18n";
import { Value } from "./entities/Value";
import * as Hex from "visual/utils/color/Hex";
import { MValue } from "visual/utils/value";
import { Literal } from "visual/utils/types/Literal";
import { ElementModel } from "visual/component/Elements/Types";
import { StyleObject } from "visual/component/Controls/Border";

const model = DEFAULT_VALUE;

describe("Testing 'isEmptyWidth' function", function() {
  test("If width type is grouped and width empty, return true", () => {
    const m: Value = {
      ...model,
      widthType: WidthType.GROUPED,
      width: Width.empty
    };
    expect(isEmptyWidth(m)).toBe(true);
  });

  test("If width type is grouped and width not empty, return false", () => {
    const m: Value = {
      ...model,
      widthType: WidthType.GROUPED,
      width: Width.unsafe(1)
    };
    expect(isEmptyWidth(m)).toBe(false);
  });

  test("If width type is ungrouped and all edges widths are empty, return true", () => {
    const m: Value = {
      ...model,
      widthType: WidthType.UNGROUPED,
      topWidth: Width.unsafe(0),
      rightWidth: Width.unsafe(0),
      bottomWidth: Width.unsafe(0),
      leftWidth: Width.unsafe(0)
    };
    expect(isEmptyWidth(m)).toBe(true);
  });

  test("If width type is ungrouped and at least one edge is not empty, return true", () => {
    const m: Value = {
      ...model,
      widthType: WidthType.UNGROUPED,
      topWidth: Width.unsafe(0),
      rightWidth: Width.unsafe(0),
      bottomWidth: Width.unsafe(0),
      leftWidth: Width.unsafe(9)
    };
    expect(isEmptyWidth(m)).toBe(false);
  });
});

describe("Testing '_getWidth' function", function() {
  const valid = times(100, Width.unsafe);

  valid.forEach(width =>
    test(`Expect ${width}`, () => {
      expect(getWidth({ ...model, width })).toBe(width);
    })
  );
});

describe("Testing '_setWidth' function", function() {
  test("If value is 0 and other values are 0, temp should not be set to 0", () => {
    (["topWidth", "rightWidth", "bottomWidth", "leftWidth"] as const).map(k => {
      const temp = capByPrefix("temp", k);
      const m: Value = {
        ...model,
        topWidth: Width.unsafe(0),
        rightWidth: Width.unsafe(0),
        bottomWidth: Width.unsafe(0),
        leftWidth: Width.unsafe(0),
        [k]: 2
      };

      expect(_setWidthEdge(k, Width.empty, m)).toMatchObject({
        [temp]: 2
      });
    });
  });

  test("If all edges are equal and higher then 0, setWidth to same value", () => {
    const m: Value = {
      ...model,
      width: Width.unsafe(1),
      topWidth: Width.unsafe(2),
      rightWidth: Width.unsafe(2),
      bottomWidth: Width.unsafe(2),
      leftWidth: Width.unsafe(3)
    };

    const m2: Value = {
      ...model,
      width: Width.unsafe(1),
      topWidth: Width.unsafe(0),
      rightWidth: Width.unsafe(0),
      bottomWidth: Width.unsafe(0),
      leftWidth: Width.unsafe(3)
    };

    expect(_setWidthEdge("leftWidth", Width.unsafe(2), m)).toMatchObject({
      width: Width.unsafe(2)
    });
    expect(_setWidthEdge("leftWidth", Width.empty, m2)).toMatchObject({
      width: Width.unsafe(1)
    });
  });
});

describe("Testing 'fromElementModel' function", function() {
  const db: ElementModel = {
    style: Style.SOLID,
    tempStyle: Style.DASHED,
    colorHex: "#333",
    colorOpacity: 0.5,
    tempColorOpacity: 0.7,
    colorPalette: "color1",
    tempColorPalette: "color2",
    widthType: WidthType.GROUPED,
    width: Width.unsafe(1),
    tempWidth: Width.unsafe(2),
    topWidth: Width.unsafe(3),
    tempTopWidth: Width.unsafe(4),
    rightWidth: Width.unsafe(5),
    tempRightWidth: Width.unsafe(6),
    bottomWidth: Width.unsafe(7),
    tempBottomWidth: Width.unsafe(8),
    leftWidth: Width.unsafe(9),
    tempLeftWidth: Width.unsafe(10)
  };

  test("If the element model key is missing or is not valid, use use empty value for default", () => {
    const m: Value = model;
    const r = {
      ...model,
      style: Style.empty,
      opacity: Opacity.empty,
      palette: Palette.empty,
      tempPalette: Palette.empty,
      widthType: WidthType.empty,
      width: Width.empty,
      topWidth: Width.empty,
      rightWidth: Width.empty,
      bottomWidth: Width.empty,
      leftWidth: Width.empty
    };

    expect(fromElementModel(k => m[k as keyof Value])).toMatchObject(r);
  });

  test("If key exists and value is valid, use key value", () => {
    const {
      colorHex,
      colorOpacity,
      tempColorOpacity,
      colorPalette,
      tempColorPalette,
      ...other
    } = db;

    const r = {
      ...other,
      hex: colorHex,
      opacity: colorOpacity,
      tempOpacity: tempColorOpacity,
      palette: colorPalette,
      tempPalette: tempColorPalette
    };

    expect(fromElementModel(k => db[k] as MValue<Literal>)).toMatchObject(r);
  });

  test("If style is empty, set opacity, palette and width to their empty values", () => {
    const _db: ElementModel = { ...db, style: Style.empty };

    expect(fromElementModel(k => _db[k] as MValue<Literal>)).toMatchObject({
      opacity: Opacity.empty,
      palette: Palette.empty,
      width: Width.unsafe(0),
      topWidth: Width.unsafe(0),
      rightWidth: Width.unsafe(0),
      bottomWidth: Width.unsafe(0),
      leftWidth: Width.unsafe(0)
    });
  });

  test("If opacity is empty, set style, palette and width to their empty values", () => {
    const _db: ElementModel = { ...db, colorOpacity: Opacity.empty };

    expect(fromElementModel(k => _db[k] as MValue<Literal>)).toMatchObject({
      style: Style.empty,
      palette: Palette.empty,
      width: Width.empty,
      topWidth: Width.empty,
      rightWidth: Width.empty,
      bottomWidth: Width.empty,
      leftWidth: Width.empty
    });
  });

  test("If width type is 'grouped' and width is empty, set style, palette and opacity to their empty values", () => {
    const _db: ElementModel = {
      ...db,
      widthType: WidthType.GROUPED,
      width: Width.empty
    };

    expect(fromElementModel(k => _db[k] as MValue<Literal>)).toMatchObject({
      style: Style.empty,
      palette: Palette.empty,
      opacity: Opacity.empty,
      topWidth: Width.empty,
      rightWidth: Width.empty,
      bottomWidth: Width.empty,
      leftWidth: Width.empty
    });
  });

  test("If width type is 'ungrouped' and all edge widths are empty, set style, palette and opacity to their empty values", () => {
    const _db: ElementModel = {
      ...db,
      widthType: WidthType.UNGROUPED,
      topWidth: Width.empty,
      rightWidth: Width.empty,
      bottomWidth: Width.empty,
      leftWidth: Width.empty
    };

    expect(fromElementModel(k => _db[k] as MValue<Literal>)).toMatchObject({
      style: Style.empty,
      palette: Palette.empty,
      opacity: Opacity.empty,
      width: Width.empty
    });
  });

  test("If width type is 'ungrouped' and at least one edge width is not empty, do not empty style, palette and opacity values", () => {
    [
      { topWidth: 1 },
      { rightWidth: 1 },
      { bottomWidth: 1 },
      { leftWidth: Width.unsafe(1) }
    ].map(v => {
      const _db: ElementModel = {
        ...db,
        topWidth: Width.empty,
        rightWidth: Width.empty,
        bottomWidth: Width.empty,
        leftWidth: Width.empty,
        widthType: WidthType.UNGROUPED,
        ...v
      };

      expect(fromElementModel(k => _db[k] as MValue<Literal>)).toMatchObject({
        style: _db.style,
        palette: _db.colorPalette,
        opacity: _db.colorOpacity,
        width: _db.width
      });
    });
  });
});

describe("Testing 'toElementModel' function", function() {
  test("If the element model key is missing or is not valid, use use empty value for default", () => {
    const m: Value = model;
    const r = {
      style: Style.empty,
      tempStyle: model.tempStyle,
      colorHex: model.hex,
      colorOpacity: Opacity.empty,
      tempColorOpacity: model.tempOpacity,
      colorPalette: Palette.empty,
      tempColorPalette: Palette.empty,
      widthType: WidthType.empty,
      width: Width.empty,
      tempWidth: model.tempWidth,
      topWidth: Width.empty,
      tempTopWidth: model.tempTopWidth,
      rightWidth: Width.empty,
      tempRightWidth: model.tempRightWidth,
      bottomWidth: Width.empty,
      tempBottomWidth: model.tempBottomWidth,
      leftWidth: Width.empty,
      tempLeftWidth: model.tempLeftWidth
    };

    expect(toElementModel(m, k => k)).toMatchObject(r);
  });

  test("If key exists and value is valid, use key value", () => {
    const m: Value = {
      ...model,
      style: Style.DOTTED,
      tempStyle: Style.DOTTED,
      hex: Hex.unsafe("#555555"),
      opacity: Opacity.unsafe(0.1),
      tempOpacity: Opacity.unsafe(0.1),
      palette: COLOR3,
      tempPalette: COLOR3,
      widthType: WidthType.UNGROUPED,
      width: Width.unsafe(1),
      tempWidth: Width.unsafe(1),
      topWidth: Width.unsafe(1),
      tempTopWidth: Width.unsafe(1),
      rightWidth: Width.unsafe(1),
      tempRightWidth: Width.unsafe(1),
      bottomWidth: Width.unsafe(1),
      tempBottomWidth: Width.unsafe(1),
      leftWidth: Width.unsafe(1),
      tempLeftWidth: Width.unsafe(1)
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

    expect(toElementModel(m, k => k)).toMatchObject(r);
  });
});

describe("Testing 'getStyleObject' function", function() {
  const objects: Array<[Style.Style, StyleObject]> = [
    ["none", { id: BorderStyle.NONE, title: t("None") }],
    ["solid", { id: BorderStyle.SOLID, icon: "nc-solid" }],
    ["dashed", { id: BorderStyle.DASHED, icon: "nc-dashed" }],
    ["dotted", { id: BorderStyle.DOTTED, icon: "nc-dotted" }]
  ];

  test.each(objects)("The '%s' style has object", (k, obj) =>
    expect(getStyleObject(k)).toMatchObject(obj)
  );
});
