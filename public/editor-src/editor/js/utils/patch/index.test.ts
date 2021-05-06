import { apply, Patcher, patcher } from "./index";
import { Getter } from "visual/utils/model";

/**
 * Testing patch function behavior
 */
export const testPatchFunction = <V, M extends P, P>(
  patch: Patcher<V, M, P>,
  getter: Getter<V, M>,
  valid: V[],
  m: M
) => {
  describe("Testing patch function behaviour", function() {
    test("If value is equal to current value, return undefined", () => {
      valid.forEach(v => {
        const p = patch(v, m);
        if (p) {
          expect(patch(v, { ...m, ...p })).toEqual(undefined);
        }
      });
    });

    test("If value is valid, return object containing the value", () => {
      valid.forEach(v => {
        const p = patch(v, m);
        if (p) {
          expect(getter({ ...m, ...p })).toBe(v);
        }
      });
    });
  });
};

describe("Testing 'patcher' function", function() {
  type M = { test: string };

  const m: M = { test: "" };
  const valid = ["test1", "test2", "test3"];
  const getter = (m: M): string => m.test;
  const fn = (v: string): M => ({ test: v });
  const patch = patcher(getter, fn);

  testPatchFunction(patch, getter, valid, m);

  test("Return same object as the original patch function would return", () => {
    valid.forEach(v => expect(patch(v, m)).toEqual(fn(v)));
  });
});

describe("Testing 'apply' function", function() {
  type P1 = { test1: number };
  type P2 = { test2: number };
  type M = { test1: number; test2: number };

  const m: M = { test1: 0, test2: 0 };

  const patch1 = (v: number): P1 => ({ test1: v });
  const patch2 = (v: number): P2 => ({ test2: v });

  test("Function returns an object with values of multiple patches", () => {
    const result: M = { test1: 1, test2: 2 };

    expect(
      apply<number, number, P1, P2, M>(
        [
          [patch1, 1],
          [patch2, 2]
        ],
        m
      )
    ).toEqual(result);
  });

  test("The returned object, contains only values added by patches", () => {
    const result: M = { test1: 1, test2: 2 };

    expect(
      apply(
        [
          [patch1, 1],
          [patch2, 2]
        ],
        { ...m, test3: 3 }
      )
    ).toEqual(result);
  });
});
