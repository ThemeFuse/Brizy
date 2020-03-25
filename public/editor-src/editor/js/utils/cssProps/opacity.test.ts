import { empty, onEmpty, read, toOpacity } from "./opacity";
import * as Opacity from "./opacity";
import {
  testMonoidBehavior,
  testToValue
} from "visual/utils/value/utilites.test";
import { testReader } from "visual/utils/types/Type.test";
import { testMonoid } from "visual/utils/types/Monoid.test";

describe("Testing 'read' function", function() {
  const valid = [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1];
  const invalid = [undefined, null, {}, [], -1, -0.4, 1.1, 2];

  testReader(read, valid, invalid);
});

describe("Testing Opacity monoidal behavior", function() {
  const valid = [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1];
  testMonoid(Opacity, valid);
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
