import { onEmpty, onNullish, onUndefined } from "visual/utils/value/index";
import { testMonoidBehavior } from "visual/utils/value/utilites.test";

describe("Testing 'onUndefined' function", function() {
  test("Return value if it is not undefined", () => {
    expect(onUndefined(2, 1)).toBe(2);
  });

  test("Return orElse if value is undefined", () => {
    expect(onUndefined(undefined, 1)).toBe(1);
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

describe("Testing 'onNullish' function", function() {
  test.each([[undefined, 1], [null, 2]])(
    "If value is %s, return %i",
    (orElse, v) => expect(onNullish(orElse, v)).toBe(v)
  );

  test("If value is not null or undefined, return it", () => {
    const orElse = {};
    [0, "", "test", {}, []].map(v => expect(onNullish(orElse, v)).toBe(v));
  });
});
