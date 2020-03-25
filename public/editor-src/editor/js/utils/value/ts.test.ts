import { identity } from "underscore";
import { mApply, mCompose } from "visual/utils/value/index";

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
