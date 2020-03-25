import { apply, patcher } from "./index";

/**
 * Testing patch function behavior
 *
 * @template V
 * @template M
 * @template R
 *
 * @param {{function(v: V, m: M): R}} patch
 * @param {function(m: M, orElse: V): V} getter
 * @param {V[]} valid
 * @param {*[]} invalid
 */
export const testPatchFunction = (patch, getter, valid, invalid) => {
  describe("Testing patch function behaviour", function() {
    test("If value is invalid, return undefined", () => {
      invalid.forEach(v => expect(patch(v, {})).toEqual(undefined));
    });

    test("If value is equal to current value, return undefined", () => {
      valid.forEach(v => expect(patch(v, patch(v, {}))).toEqual(undefined));
    });

    test("If value is valid, return object containing the value", () => {
      valid.forEach(v => expect(getter(patch(v, {}), {})).toBe(v));
    });
  });
};

describe("Testing 'patcher' function", function() {
  const invalid = [undefined, null, "", "test", []];
  const valid = ["test1", "test2", "test3"];
  const toValue = (v, orElse) => (valid.includes(v) ? v : orElse);
  const getter = (m, e) => m.test || e;
  const fn = v => ({ test: v });
  const patch = patcher(toValue, getter, fn);

  testPatchFunction(patch, getter, valid, invalid);

  test("Return same object as the original patch function would return", () => {
    valid.forEach(v => expect(patch(v, {})).toEqual(fn(v, {})));
  });
});

describe("Testing 'apply' function", function() {
  const patch1 = v => ({ test1: v });
  const patch2 = v => ({ test2: v });
  const patches = [[patch1, 1], [patch2, 2]];

  test("Function returns an object with values of multiple patches", () => {
    const result = { test1: 1, test2: 2 };

    expect(apply(patches, {})).toEqual(result);
  });

  test("The returned object, contains only values added by patches", () => {
    const result = { test1: 1, test2: 2 };

    expect(apply(patches, { test3: 3 })).toEqual(result);
  });
});
