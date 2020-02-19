import {
  NONE,
  SOLID,
  DASHED,
  DOTTED,
  empty,
  styles,
  toStyle,
  onEmpty
} from "./style";
import {
  testMonoidBehavior,
  testToValue
} from "visual/utils/value/utilites.test";

describe("Testing border style constructors", function() {
  test("NONE should be 'none'", () => expect(NONE).toBe("none"));
  test("SOLID should be 'solid'", () => expect(SOLID).toBe("solid"));
  test("DASHED should be 'dashed'", () => expect(DASHED).toBe("dashed"));
  test("DOTTED should be 'dotted'", () => expect(DOTTED).toBe("dotted"));
});

describe("Testing 'empty' value", function() {
  test("Should be NONE", () => {
    expect(empty).toBe(NONE);
  });
});

describe("Testing 'styles' value", function() {
  test("Should be ['none','solid','dashed','dotted']", () => {
    expect(styles).toEqual([NONE, SOLID, DASHED, DOTTED]);
  });
});

describe("Testing 'toStyle' function", function() {
  testToValue(toStyle, styles, [undefined, null, "test", 1]);
});

describe("Testing 'onEmpty' function", function() {
  const noneEmpty = styles.filter(v => v !== empty);

  testToValue(onEmpty, noneEmpty, [undefined, null, "test", 1, empty]);
  testMonoidBehavior(onEmpty, empty, styles);
});
