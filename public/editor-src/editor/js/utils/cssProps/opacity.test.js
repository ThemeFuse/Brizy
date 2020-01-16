import { empty, onEmpty, toOpacity } from "./opacity";
import {
  testMonoidBehavior,
  testToValue
} from "visual/utils/value/utilites.test";

describe("Testing 'empty' value", function() {
  expect(empty).toBe(0);
});

describe("Testing 'toOpacity' function", function() {
  const valid = [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1];
  const invalid = [undefined, null, {}, [], -1, -0.4, 1.1, 2];
  testToValue(toOpacity, valid, invalid);
});

describe("Testing 'onEmpty' function", function() {
  const valid = [0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1];
  const invalid = [undefined, null, {}, [], 0, -1, -0.4, 1.1, 2];

  testToValue(onEmpty, valid, invalid);
  testMonoidBehavior(onEmpty, 0, [0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7]);
});
