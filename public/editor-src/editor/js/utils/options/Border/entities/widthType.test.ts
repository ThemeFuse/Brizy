import { head } from "es-toolkit";
import { testMonoid } from "visual/utils/types/Monoid.test";
import { testReader } from "visual/utils/types/Type.test";
import * as WidthType from "./widthType";
import { GROUPED, UNGROUPED, empty, read, types } from "./widthType";

describe("Testing GROUPED constant", function () {
  test("Should be 'grouped'", () => {
    expect(GROUPED).toBe("grouped");
  });
});

describe("Testing UNGROUPED constant", function () {
  test("Should be 'ungrouped'", () => {
    expect(UNGROUPED).toBe("ungrouped");
  });
});

describe("Testing 'types' constant", function () {
  test("Should be ['grouped', 'ungrouped']", () => {
    expect(types).toEqual([GROUPED, UNGROUPED]);
  });

  test("Empty value should be first", () => {
    expect(head(types)).toBe(empty);
  });
});

describe("Testing 'empty' value", function () {
  test("Should be GROUPED", () => {
    expect(empty).toBe(GROUPED);
  });
});

describe("Testing 'read' function", function () {
  testReader(read, types, [1, "3", undefined, null, [], {}]);
});

describe("Testing Border Width Type monoidal behavior", function () {
  testMonoid(WidthType, types);
});
