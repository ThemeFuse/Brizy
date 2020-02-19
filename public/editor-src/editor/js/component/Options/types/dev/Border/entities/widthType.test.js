import { head, tail } from "underscore";
import { empty, GROUPED, onEmpty, toType, types, UNGROUPED } from "./widthType";
import {
  testMonoidBehavior,
  testToValue
} from "visual/utils/value/utilites.test";

const invalidTypes = [undefined, null, "test", 1];

describe("Testing GROUPED constant", function() {
  test("Should be 'grouped'", () => {
    expect(GROUPED).toBe("grouped");
  });
});

describe("Testing UNGROUPED constant", function() {
  test("Should be 'ungrouped'", () => {
    expect(UNGROUPED).toBe("ungrouped");
  });
});

describe("Testing 'types' constant", function() {
  test("Should be ['grouped', 'ungrouped']", () => {
    expect(types).toEqual([GROUPED, UNGROUPED]);
  });

  test("Empty value should be first", () => {
    expect(head(types)).toBe(empty);
  });
});

describe("Testing 'empty' value", function() {
  test("Should be GROUPED", () => {
    expect(empty).toBe(GROUPED);
  });
});

describe("Testing 'toType' function", function() {
  testToValue(toType, types, invalidTypes);
});

describe("Testing 'onEmpty' function", function() {
  const noneEmpty = tail(types);

  testToValue(onEmpty, noneEmpty, invalidTypes);
  testMonoidBehavior(onEmpty, empty, noneEmpty);
});
