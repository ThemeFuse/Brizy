import { Effects } from "../../Transform/types";
import {
  Type,
  flattEffects,
  flattenObject,
  getEnabledEffects,
  getPatchType,
  hasActive,
  hasEffect,
  prefixKeys
} from "../effects";

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
        key1NestedKey1DeeplyNestedKey1: "value1",
        key2NestedKey2DeeplyNestedKey2: "value2"
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
        key1NestedKey2DeeplyNestedKey1: "value2",
        key2NestedKey3DeeplyNestedKey2: "value3",
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
        key2NestedKey2DeeplyNestedKey1: {}
      }
    ]
  ])("flatten of %o is not equal of %o", (input, output) =>
    expect(flattenObject(input)).toStrictEqual(output)
  );
});

describe("hasEffect function", () => {
  test.each([
    [{}, false],
    [{ a: undefined }, false],
    [{ b: { c: 1 } }, false]
  ])("variables from %s hasn't effect", (input, output) =>
    expect(hasEffect(input, Effects)).toBe(output)
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
    ]
  ])("variables from %s have effect", (input, output) =>
    expect(hasEffect(input, Effects)).toBe(output)
  );

  test("should pass if at least one effect is not undefined", () => {
    const input = {
      rotate: { rotate: 45 },
      offset: undefined,
      anchorPoint: undefined
    };

    expect(hasEffect(input, Effects)).toBe(true);
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
    expect(getPatchType(input, Effects)).toBe(output)
  );

  test.each([
    [{ active: "rotate" }, "active"],
    [{ rotate: { rotate: 45 } }, "effect"],
    [{ active: "rotate", rotate: { rotate: 45 } }, "multiple"]
  ])("variables from %s have type", (input, output) =>
    expect(getPatchType(input, Effects)).toBe(output)
  );

  test("should return the same type if it is defined", () => {
    const input = {
      type: Type.active,
      active: "rotate",
      rotate: { rotate: 45 }
    };

    expect(getPatchType(input, Effects)).toBe("active");
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
    expect(flattEffects(input, Effects)).toStrictEqual(output)
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

    expect(flattEffects(input, Effects)).toStrictEqual({
      rotateRotate: 45,
      offsetOffsetX: 10,
      offsetOffsetY: 20
    });
  });
});
