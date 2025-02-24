import { times } from "es-toolkit/compat";
import { StyleObject } from "visual/component/Controls/Border";
import { t } from "visual/utils/i18n";
import { capByPrefix } from "visual/utils/string";
import { defaultValue } from "../converters";
import { Value } from "../entities/Value";
import * as Style from "../entities/style";
import * as BorderStyle from "../entities/style";
import * as Width from "../entities/width";
import { getWidth } from "../model";
import { _setWidthEdge, getStyleObject } from "../utils";

const model = defaultValue;

describe("Testing '_getWidth' function", function () {
  const valid = times(100, Width.unsafe);

  valid.forEach((width) =>
    test(`Expect ${width}`, () => {
      expect(getWidth({ ...model, width })).toBe(width);
    })
  );
});

describe("Testing '_setWidth' function", function () {
  test("If value is 0 and other values are 0, temp should not be set to 0", () => {
    (["topWidth", "rightWidth", "bottomWidth", "leftWidth"] as const).map(
      (k) => {
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
      }
    );
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

describe("Testing 'getStyleObject' function", function () {
  const objects: Array<[Style.Style, StyleObject]> = [
    ["none", { id: BorderStyle.NONE, title: t("None") }],
    ["solid", { id: BorderStyle.SOLID, icon: "nc-solid" }],
    ["dashed", { id: BorderStyle.DASHED, icon: "nc-dashed" }],
    ["dotted", { id: BorderStyle.DOTTED, icon: "nc-dotted" }],
    ["double", { id: BorderStyle.DOUBLE, icon: "nc-double" }],
    ["groove", { id: BorderStyle.GROOVE, icon: "nc-groove" }],
    ["ridge", { id: BorderStyle.RIDGE, icon: "nc-ridge" }],
    ["inset", { id: BorderStyle.INSET, icon: "nc-inset" }],
    ["outset", { id: BorderStyle.OUTSET, icon: "nc-outset" }]
  ];

  test.each(objects)("The '%s' style has object", (k, obj) =>
    expect(getStyleObject(k)).toMatchObject(obj)
  );
});
