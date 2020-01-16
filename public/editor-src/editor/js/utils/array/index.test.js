import { onEmpty, toArray } from "visual/utils/array/index";

describe("Testing 'toArray' function", () => {
  test("Always return same value if it is an valid array", () => {
    [[], [1], [undefined], [null, ""]].map(a => expect(toArray(a)).toBe(a));
  });

  test("Always return empty array for none array values", () => {
    [undefined, null, "", 1, {}].map(a => expect(toArray(a)).toEqual([]));
  });
});

describe("Testing 'onEmpty' function", () => {
  test("Always return the array, is it has at leas one value", () => {
    [[1], [1, 2], [1, 2, 3]].forEach(a => expect(onEmpty(null, a)).toBe(a));
  });

  test("Return the default value, if array is empty", () => {
    const def = {};
    expect(onEmpty(def, [])).toBe(def);
  });

  test("Always return default value if the array is not a valid array", () => {
    const def = {};
    [undefined, null, 1, "test", {}].forEach(a =>
      expect(onEmpty(def, a)).toBe(def)
    );
  });
});
