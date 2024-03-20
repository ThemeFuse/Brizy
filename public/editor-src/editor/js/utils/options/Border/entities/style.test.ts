import * as Style from "./style";
import { testReader } from "visual/utils/types/Type.test";
import { testMonoid } from "visual/utils/types/Monoid.test";

describe("Testing border style constructors", function() {
  test("NONE should be 'none'", () => expect(Style.NONE).toBe("none"));
  test("SOLID should be 'solid'", () => expect(Style.SOLID).toBe("solid"));
  test("DASHED should be 'dashed'", () => expect(Style.DASHED).toBe("dashed"));
  test("DOTTED should be 'dotted'", () => expect(Style.DOTTED).toBe("dotted"));
  test("DOUBLE should be 'double'", () => expect(Style.DOUBLE).toBe("double"));
  test("GROOVE should be 'groove'", () => expect(Style.GROOVE).toBe("groove"));
  test("RIDGE should be 'ridge'", () => expect(Style.RIDGE).toBe("ridge"));
  test("INSET should be 'inset'", () => expect(Style.INSET).toBe("inset"));
  test("OUTSET should be 'outset'", () => expect(Style.OUTSET).toBe("outset"));
});

describe("Testing 'empty' value", function() {
  test("Should be NONE", () => {
    expect(Style.empty).toBe(Style.NONE);
  });
});

describe("Testing 'styles' value", function() {
  test("Should be ['none','solid','dashed','dotted']", () => {
    expect(Style.styles).toEqual([
      Style.NONE,
      Style.SOLID,
      Style.DASHED,
      Style.DOTTED,
      Style.DOUBLE,
      Style.GROOVE,
      Style.RIDGE,
      Style.INSET,
      Style.OUTSET
    ]);
  });
});

describe("Testing 'read' function", function() {
  const invalid = [null, undefined, "1", 2, "test", [], {}];
  testReader(Style.read, Style.styles, invalid);
});

describe("Testing Border Style monoid behavior", function() {
  testMonoid(Style, Style.styles);
});
