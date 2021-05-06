import { sortBy, identity } from "underscore";
import { empty, weights, Weight } from "visual/utils/fonts/Weight";

describe("Testing font weights constants", function() {
  test("THIN should be 100", () => expect(Weight.THIN).toBe(100));
  test("EXTRA_LIGHT should be 200", () => expect(Weight.EXTRA_LIGHT).toBe(200));
  test("LIGHT should be 300", () => expect(Weight.LIGHT).toBe(300));
  test("NORMAL should be 400", () => expect(Weight.NORMAL).toBe(400));
  test("MEDIUM should be 500", () => expect(Weight.MEDIUM).toBe(500));
  test("SEMI_BOLD should be 600", () => expect(Weight.SEMI_BOLD).toBe(600));
  test("BOLD should be 700", () => expect(Weight.BOLD).toBe(700));
  test("EXTRA_BOLD should be 800", () => expect(Weight.EXTRA_BOLD).toBe(800));
  test("BLACK should be 900", () => expect(Weight.BLACK).toBe(900));
});

describe("Testing 'weights' constant", function() {
  test("Should look like: [100, 200, 300, 400, 500, 600, 700, 800, 900]", () => {
    expect(weights).toEqual(
      Object.values([100, 200, 300, 400, 500, 600, 700, 800, 900])
    );
  });

  test("Should be in increasing order", () => {
    expect(sortBy(weights, identity)).toEqual(weights);
  });
});

describe("Testing 'empty' constant", function() {
  test("Should be NORMAL", () => {
    expect(empty).toBe(Weight.NORMAL);
  });
});
