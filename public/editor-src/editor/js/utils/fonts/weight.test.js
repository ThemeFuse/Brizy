import { sortBy, identity } from "underscore";
import {
  BLACK,
  BOLD,
  empty,
  EXTRA_BOLD,
  EXTRA_LIGHT,
  LIGHT,
  MEDIUM,
  NORMAL,
  onEmpty,
  SEMI_BOLD,
  THIN,
  toWeight,
  weights
} from "visual/utils/fonts/weight";
import {
  testMonoidBehavior,
  testToValue
} from "visual/utils/value/utilites.test";

export const valid = weights;
export const invalid = [undefined, null, "", "100", {}, [], 0, 1, 1000, 150];

describe("Testing font weights constants", function() {
  test("THIN should be 100", () => expect(THIN).toBe(100));
  test("EXTRA_LIGHT should be 200", () => expect(EXTRA_LIGHT).toBe(200));
  test("LIGHT should be 300", () => expect(LIGHT).toBe(300));
  test("NORMAL should be 400", () => expect(NORMAL).toBe(400));
  test("MEDIUM should be 500", () => expect(MEDIUM).toBe(500));
  test("SEMI_BOLD should be 600", () => expect(SEMI_BOLD).toBe(600));
  test("BOLD should be 700", () => expect(BOLD).toBe(700));
  test("EXTRA_BOLD should be 800", () => expect(EXTRA_BOLD).toBe(800));
  test("BLACK should be 900", () => expect(BLACK).toBe(900));
});

describe("Testing 'weights' constant", function() {
  test("Should look like: [THIN, EXTRA_LIGHT, LIGHT, NORMAL, MEDIUM, SEMI_BOLD, BOLD, EXTRA_BOLD, BLACK]", () => {
    const w = [
      THIN,
      EXTRA_LIGHT,
      LIGHT,
      NORMAL,
      MEDIUM,
      SEMI_BOLD,
      BOLD,
      EXTRA_BOLD,
      BLACK
    ];
    expect(weights).toEqual(w);
  });

  test("Should be in increasing order", () => {
    expect(sortBy(weights, identity)).toEqual(weights);
  });
});

describe("Testing 'empty' constant", function() {
  test("Should be NORMAL", () => {
    expect(empty).toBe(NORMAL);
  });
});

describe("Testing 'toWeight' function", function() {
  testToValue(toWeight, valid, invalid);
});

describe("Testing 'onEmpty' function", function() {
  testToValue(onEmpty, valid.filter(i => i !== empty), [...invalid, empty]);
  testMonoidBehavior(onEmpty, empty, valid.filter(i => i !== empty));
});
