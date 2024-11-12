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
  flattEffects,
  flattenObject,
  getAnchorVars,
  getEnabledEffects,
  getFlipVars,
  getOffsetVars,
  getPatchType,
  getRotateVars,
  getScaleVars,
  getSkewVars,
  getTransformCSSVars,
  hasActive,
  hasEffect,
  makeCSSVar,
  prefixKeys
} from "../utils";
import { OptionPatch } from "visual/component/Options/types";

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

describe("prefixKeys function", () => {
  const prefix = "prefix_";
  const obj = { key1: "value1", key2: "value2" };

  test.each([
    ["", {}, {}],
    ["", obj, obj],
    [
      prefix,
      obj,
      {
        prefix_Key1: "value1",
        prefix_Key2: "value2"
      }
    ],
    [
      prefix,
      { kk: "1", kb: "2" },
      {
        prefix_Kb: "2",
        prefix_Kk: "1"
      }
    ]
  ])("prefix %s with object %o does not match with %o", (arg1, arg2, output) =>
    expect(prefixKeys(arg1, arg2)).toStrictEqual(output)
  );
});

describe("flattenObject function", () => {
  test.each([
    [{}, {}],
    [
      {
        key1: { nestedKey1: "value1" },
        key2: { nestedKey2: "value2" }
      },
      {
        key1NestedKey1: "value1",
        key2NestedKey2: "value2"
      }
    ],
    [
      {
        key1: { nestedKey1: { deeplyNestedKey1: "value1" } },
        key2: { nestedKey2: { deeplyNestedKey2: "value2" } }
      },
      {
        key1NestedKey1: {
          deeplyNestedKey1: "value1"
        },
        key2NestedKey2: {
          deeplyNestedKey2: "value2"
        }
      }
    ],
    [
      {
        key1: {
          nestedKey1: "value1",
          nestedKey2: { deeplyNestedKey1: "value2" }
        },
        key2: {
          nestedKey3: { deeplyNestedKey2: "value3" },
          nestedKey4: "value4"
        }
      },
      {
        key1NestedKey1: "value1",
        key1NestedKey2: {
          deeplyNestedKey1: "value2"
        },
        key2NestedKey3: {
          deeplyNestedKey2: "value3"
        },
        key2NestedKey4: "value4"
      }
    ],
    [
      {
        key1: { nestedKey1: {} },
        key2: { nestedKey2: { deeplyNestedKey1: {} } }
      },
      {
        key1NestedKey1: {},
        key2NestedKey2: {
          deeplyNestedKey1: {}
        }
      }
    ]
  ])("flatten of %o is not equal of %o", (input, output) =>
    expect(flattenObject(input)).toStrictEqual(output)
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

describe("hasEffect function", () => {
  test.each([
    [{}, false],
    [{ a: undefined }, false],
    [{ b: { c: 1 } }, false]
  ])("variables from %s hasn't effect", (input, output) =>
    expect(hasEffect(input)).toBe(output)
  );

  test.each([
    [
      {
        rotate: { rotate: 45 }
      },
      true
    ],
    [
      {
        offset: { offsetX: 10, offsetY: 20 }
      },
      true
    ],
    [
      {
        anchorPoint: { x: 0.5, y: 0.5 }
      },
      true
    ]
  ])("variables from %s have effect", (input, output) =>
    expect(hasEffect(input)).toBe(output)
  );

  test("should pass if at least one effect is not undefined", () => {
    const input = {
      rotate: { rotate: 45 },
      offset: undefined,
      anchorPoint: undefined
    };

    expect(hasEffect(input)).toBe(true);
  });
});

describe("hasActive function", () => {
  test.each([
    [{}, false],
    [{ active: undefined }, false],
    [{ active: "" }, false]
  ])("variables from %s hasn't active", (input, output) =>
    expect(hasActive(input)).toBe(output)
  );

  test("should pass if active is not undefined", () => {
    const input = {
      active: "rotate",
      rotate: { rotate: 45 }
    };

    expect(hasActive(input)).toBe(true);
  });
});

describe("getPatchType function", () => {
  test.each([
    [{}, undefined],
    [{ active: undefined }, undefined],
    [{ active: "", rotate: undefined }, undefined]
  ])("variables from %s will return undefined", (input, output) =>
    expect(getPatchType(input as OptionPatch<"transform">)).toBe(output)
  );

  test.each([
    [{ active: "rotate" }, "active"],
    [{ rotate: { rotate: 45 } }, "effect"],
    [{ active: "rotate", rotate: { rotate: 45 } }, "multiple"]
  ])("variables from %s have type", (input, output) =>
    expect(getPatchType(input as OptionPatch<"transform">)).toBe(output)
  );

  test("should return the same type if it is defined", () => {
    const input = {
      type: "active",
      active: "rotate",
      rotate: { rotate: 45 }
    };

    expect(getPatchType(input as OptionPatch<"transform">)).toBe("active");
  });
});

describe("getEnabledEffects function", () => {
  test.each([
    [{}, {}],
    [{ rotate: undefined }, {}],
    [{ rotate: undefined, offset: {} }, {}]
  ])("variables %s haven't enabled effects", (input, output) =>
    expect(getEnabledEffects(input)).toStrictEqual(output)
  );

  test("should return enabled effects", () => {
    const input = {
      offset: { offsetX: 10, offsetY: 20 },
      active: "rotate",
      rotate: { rotate: 45 },
      skew: {},
      scale: undefined
    };

    expect(getEnabledEffects(input)).toStrictEqual({
      rotateEnabled: true,
      offsetEnabled: true
    });
  });
});

describe("flattEffects function", () => {
  test.each([
    [{}, {}],
    [{ rotate: undefined }, {}],
    [
      {
        a: {
          rotate: {
            rotateX: 2
          }
        }
      },
      {}
    ]
  ])("variables %s will return empty object", (input, output) =>
    expect(flattEffects(input)).toStrictEqual(output)
  );

  test("should return flatten effects", () => {
    const input = {
      rotate: { rotate: 45 },
      offset: { offsetX: 10, offsetY: 20 },
      skew: undefined,
      active: "rotate",
      a: {
        b: "c"
      }
    };

    expect(flattEffects(input)).toStrictEqual({
      rotateRotate: 45,
      offsetOffsetX: 10,
      offsetOffsetY: 20
    });
  });
});
