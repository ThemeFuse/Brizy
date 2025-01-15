import { AnchorPoint } from "visual/component/Controls/Transform/types/AnchorPoint";
import { Offset } from "visual/component/Controls/Transform/types/Offset";
import { Rotate } from "visual/component/Controls/Transform/types/Rotate";
import { Scale } from "visual/component/Controls/Transform/types/Scale";
import { Skew } from "visual/component/Controls/Transform/types/Skew";
import {
  Effect,
  Value as TransformModel
} from "visual/component/Controls/Transform/types/Value";
import { hasAnchorPoint } from "visual/component/Controls/Transform/utils";
import { MValue } from "visual/utils/value";
import {
  getAnchorVars,
  getFlipVars,
  getOffsetVars,
  getRotateVars,
  getScaleVars,
  getSkewVars,
  getTransformCSSVars,
  makeCSSVar
} from "../utils";

describe("hasAnchorPoint function", () => {
  test.each([
    ["flip", true],
    ["rotate", true],
    ["scale", true],
    ["blur", false],
    [undefined, false]
  ])("%s is not equal with %s", (input, output) =>
    expect(hasAnchorPoint(input as MValue<Effect>)).toBe(output)
  );
});

describe("makeCSSVar function", () => {
  test.each([
    [{ prop: "color", value: null }, ""],
    [
      {
        prop: "color",
        value: "blue",
        deps: [true, false, true]
      },
      ""
    ],
    [
      {
        prop: "font-size",
        value: "16px",
        suffix: "rem"
      },
      "font-size:16pxrem;"
    ],
    [{ prop: "margin", value: "20px" }, "margin:20px;"],
    [
      {
        prop: "padding",
        value: "10px",
        deps: [true, "some string"]
      },
      "padding:10px;"
    ],
    [{ prop: "width", value: "100%", suffix: "" }, "width:100%;"],
    [{ prop: "height", value: 200, suffix: "px" }, "height:200px;"],
    [
      {
        prop: "background-color",
        value: "#FFFFFF",
        suffix: undefined
      },
      "background-color:#FFFFFF;"
    ],
    [
      {
        prop: "border",
        value: 10,
        suffix: "px solid black"
      },
      "border:10px solid black;"
    ],
    [
      {
        prop: "border-radius",
        value: "5px",
        deps: []
      },
      "border-radius:5px;"
    ]
  ])("variables from %o is not equal with %s", (input, output) =>
    expect(makeCSSVar(input)).toStrictEqual(output)
  );
});

describe("getRotateVars function", () => {
  test.each([
    [
      {
        rotate: 45,
        rotateX: 30,
        rotate3D: true,
        rotateY: 60,
        rotatePerspective: 100
      },
      "--transform-rotateZ:45deg;--transform-rotateX:30deg;--transform-rotateY:60deg;--transform-rotatePerspective:100px;"
    ],
    [
      {
        rotate: 90,
        rotateX: 45,
        rotate3D: false,
        rotateY: 0
      },
      "--transform-rotateZ:90deg;"
    ],
    [
      {
        rotate: 0,
        rotateX: 0,
        rotate3D: true,
        rotateY: 0,
        rotatePerspective: 0
      },
      ""
    ],
    [{}, ""],
    [{ rotate: 100 }, "--transform-rotateZ:100deg;"]
  ])("variables from %o is not equal with %s", (input, output) =>
    expect(getRotateVars(input as Rotate)).toStrictEqual(output)
  );
});

describe("getOffsetVars function", () => {
  test.each([
    [
      { offsetX: 10, offsetY: 20 },
      "--transform-offsetX:10px;--transform-offsetY:20px;"
    ],
    [{ offsetX: 0, offsetY: 0 }, ""],
    [
      { offsetX: -10, offsetY: -20 },
      "--transform-offsetX:-10px;--transform-offsetY:-20px;"
    ],
    [{ offsetX: 10 }, "--transform-offsetX:10px;"],
    [{ offsetY: 20 }, "--transform-offsetY:20px;"]
  ])("variables from %o is not equal with %s", (input, output) =>
    expect(getOffsetVars(input as Offset)).toStrictEqual(output)
  );
});

describe("getSkewVars function", () => {
  test.each([
    [
      { skewX: 10, skewY: 20 },
      "--transform-skewX:10deg;--transform-skewY:20deg;"
    ],
    [{ skewX: 0, skewY: 0 }, ""],
    [
      { skewX: -10, skewY: -20 },
      "--transform-skewX:-10deg;--transform-skewY:-20deg;"
    ],
    [{ skewX: 10 }, "--transform-skewX:10deg;"],
    [{ skewY: 20 }, "--transform-skewY:20deg;"]
  ])("variables from %o is not equal with %s", (input, output) =>
    expect(getSkewVars(input as Skew)).toStrictEqual(output)
  );
});

describe("getScaleVars function", () => {
  test.each([
    [
      {
        scaleX: 2,
        scaleY: 1.5,
        scaleXY: 1,
        scalePreserveSize: false
      },
      "--transform-scaleX:20;--transform-scaleY:15;"
    ],
    [
      {
        scaleX: 1.5,
        scaleY: 2,
        scaleXY: 1.5,
        scalePreserveSize: true
      },
      "--transform-scaleX:15;--transform-scaleY:20;--transform-scaleXY:15;"
    ],
    [
      {
        scaleX: 0,
        scaleY: 0,
        scaleXY: 1,
        scalePreserveSize: false
      },
      ""
    ],
    [
      {
        scaleX: 1.5,
        scaleY: 2,
        scalePreserveSize: false
      },
      "--transform-scaleX:15;--transform-scaleY:20;"
    ],
    [
      {
        scaleX: 1.5,
        scaleY: 2,
        scalePreserveSize: true
      },
      "--transform-scaleX:15;--transform-scaleY:20;"
    ]
  ])("variables from %o is not equal with %s", (input, output) =>
    expect(getScaleVars(input as Scale)).toStrictEqual(output)
  );
});

describe("getFlipVars function", () => {
  test.each([
    [
      { flipHorizontal: false, flipVertical: false },
      "--transform-flipHorizontal:1;--transform-flipVertical:1;"
    ],
    [
      { flipHorizontal: true, flipVertical: false },
      "--transform-flipHorizontal:-1;--transform-flipVertical:1;"
    ],
    [
      { flipHorizontal: false, flipVertical: true },
      "--transform-flipHorizontal:1;--transform-flipVertical:-1;"
    ],
    [
      { flipHorizontal: true, flipVertical: true },
      "--transform-flipHorizontal:-1;--transform-flipVertical:-1;"
    ],
    [undefined, "--transform-flipHorizontal:1;--transform-flipVertical:1;"]
  ])("variables from %o is not equal with %s", (input, output) =>
    expect(getFlipVars(input)).toStrictEqual(output)
  );
});

describe("getAnchorVars function", () => {
  test.each([
    [
      { x: 0.5, y: 0.5 },
      "--transform-anchor-pointX:0.5;--transform-anchor-pointY:0.5;"
    ],
    [{ x: 0, y: 1 }, "--transform-anchor-pointY:1;"],
    [{ x: 1, y: 0 }, "--transform-anchor-pointX:1;"],
    [{ x: 0, y: 0 }, ""],
    [undefined, ""]
  ])("variables from %o is not equal with %s", (input, output) =>
    expect(getAnchorVars(input as unknown as AnchorPoint)).toStrictEqual(output)
  );
});

describe("getTransformCSSVars function", () => {
  test.each([
    [
      {
        rotate: { rotate: 45 },
        offset: { offsetX: 10, offsetY: 20 },
        skew: { skewX: 10, skewY: 20 },
        scale: {
          scaleX: 2,
          scaleY: 1.5,
          scaleXY: 1.5,
          scalePreserveSize: true
        },
        flip: { flipHorizontal: true, flipVertical: false },
        anchorPoint: { x: 0.5, y: 0.5 }
      },
      "--transform-rotateZ:45deg;--transform-offsetX:10px;--transform-offsetY:20px;--transform-skewX:10deg;--transform-skewY:20deg;--transform-scaleX:20;--transform-scaleY:15;--transform-scaleXY:15;--transform-flipHorizontal:-1;--transform-flipVertical:1;--transform-anchor-pointX:0.5;--transform-anchor-pointY:0.5;"
    ],
    [
      {
        rotate: { rotate: 90 },
        flip: { flipHorizontal: true, flipVertical: false }
      },
      "--transform-rotateZ:90deg;--transform-flipHorizontal:-1;--transform-flipVertical:1;"
    ],
    [
      {
        offset: { offsetX: 10, offsetY: 20 },
        anchorPoint: { x: 0.5, y: 0.5 }
      },
      "--transform-offsetX:10px;--transform-offsetY:20px;--transform-flipHorizontal:1;--transform-flipVertical:1;"
    ],
    [undefined, "--transform-flipHorizontal:1;--transform-flipVertical:1;"],
    [{}, "--transform-flipHorizontal:1;--transform-flipVertical:1;"]
  ])("variables from %o is not equal with %s", (input, output) =>
    expect(getTransformCSSVars(input as Partial<TransformModel>)).toStrictEqual(
      output
    )
  );
});
