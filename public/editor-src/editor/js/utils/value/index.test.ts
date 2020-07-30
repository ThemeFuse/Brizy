import { identity } from "underscore";
import {
  isNullish,
  onEmpty,
  onNullish,
  onUndefined,
  mApply,
  mCompose
} from "visual/utils/value/index";
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

describe("Testing 'isNullish' function", function() {
  const toString = (v: unknown): string => {
    switch (typeof v) {
      case "object":
        return JSON.stringify(v);
      case "string":
        return `"${v}"`;
      default:
        return String(v);
    }
  };

  [
    [undefined, true],
    [null, true],
    [NaN, true],
    ["", false],
    ["test", false],
    [0, false],
    [1, false],
    [[], false],
    [[1, 2], false],
    [{}, false],
    [{ a: 1 }, false]
  ].map(([v, r]) => {
    test(`If value is ${toString(v)}, return ${r}`, () => {
      expect(isNullish(v)).toBe(r);
    });
  });
});

describe("Testing 'onNullish' function", function() {
  test.each([
    [undefined, 1],
    [null, 2],
    [NaN, 3]
  ])("If value is %s, return %i", (v, orElse) =>
    expect(onNullish(orElse, v)).toBe(orElse)
  );

  test("If value is not null, NAN, or undefined, return it", () => {
    const orElse = {};
    [0, "", "test", {}, []].map(v => expect(onNullish(orElse, v)).toBe(v));
  });
});

describe("Testing 'mApply' function", function() {
  test("Identity law: mApply(id) === id", () => {
    [1, "2", "test"].map(v => expect(mApply(identity, v)).toBe(identity(v)));
  });

  test("Composition law: mApply(f . g . h) === map(f, map(g), map(h))", () => {
    const f = (v: number) => v + 1;
    const g = (v: number) => v + 2;
    const h = (v: number) => v + 3;
    const c = (v: number) => f(g(h(v)));

    [0, 1, 2, 3].map(v =>
      expect(mApply(c, v)).toBe(mApply(f, mApply(g, mApply(h, v))))
    );
  });

  test("If value is undefined, return undefined", () => {
    const f = (_: number) => 2;

    expect(mApply(f, undefined)).toBe(undefined);
  });

  test("If value is not empty, apply function", () => {
    const f = (_: number) => 2;

    expect(mApply(f, 3)).toBe(2);
  });

  test("If any callback return undefined, return undefined", () => {
    const f = (v: number) => v + 1;
    const g = (v: number) => undefined;
    const h = (v: number) => v + 3;

    expect(mApply(f, mApply(g, mApply(h, 3)))).toBe(undefined);
  });
});

describe("Testing 'mCompose' function", function() {
  test("Functions are applied from right to left", () => {
    const f = (v: number) => v + 1;
    const g = (v: number) => v * 2;

    expect(mCompose(f, g)(3)).toBe(7);
  });

  test("If any callback return undefined, return undefined", () => {
    const f = (v: number) => v + 1;
    const g = (_: unknown) => undefined;
    const h = (v: number) => v + 3;

    expect(mCompose(f, g, h)(3)).toBe(undefined);
  });
});
