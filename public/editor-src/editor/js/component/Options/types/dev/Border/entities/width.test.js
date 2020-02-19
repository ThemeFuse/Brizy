import { times, identity as id, tail } from "underscore";
import { empty, onEmpty, toWidth } from "./width";
import {
  testMonoidBehavior,
  testToValue
} from "visual/utils/value/utilites.test";

const widths = times(100, id);
const invalidWidths = [undefined, null, "test", -1];

describe("Testing 'empty' value", function() {
  test("Should be 0", () => {
    expect(empty).toBe(0);
  });
});

describe("Testing 'toWidth' function", function() {
  testToValue(toWidth, widths, invalidWidths);
});

describe("Testing 'onEmpty' function", function() {
  const noneEmpty = tail(widths);

  testToValue(onEmpty, noneEmpty, invalidWidths);
  testMonoidBehavior(onEmpty, empty, noneEmpty);
});
