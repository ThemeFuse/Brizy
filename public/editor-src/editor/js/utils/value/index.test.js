import { onEmpty, onUndefined } from "visual/utils/value/index";
import { testMonoidBehavior } from "visual/utils/value/utilites.test";

describe("Testing 'onUndefined' function", function() {
  test("Return value if it is not undefined", () => {
    expect(onUndefined(1, 2)).toBe(2);
  });

  test("Return orElse if value is undefined", () => {
    expect(onUndefined(1, undefined)).toBe(1);
  });
});

describe("Testing 'onEmpty' function", function() {
  describe("Testing 'onEmpty' with string", function() {
    testMonoidBehavior(onEmpty.bind(null, ""), "", ["a", "b", "c", "d"]);
  });

  describe("Testing 'onEmpty' with numbers", function() {
    testMonoidBehavior(onEmpty.bind(null, 0), 0, [1, 2, 3, 4, 5]);
  });
});
