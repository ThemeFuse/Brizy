import { isNullish, mCompose } from "../value";

describe("Testing 'isNullish' function", function () {
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

describe("Testing 'mCompose' function", function () {
  test("Functions are applied from right to left", () => {
    const f = (v: number) => v + 1;
    const g = (v: number) => v * 2;

    expect(mCompose(f, g)(3)).toBe(7);
  });

  test("If any callback return undefined, return undefined", () => {
    const f = (v: number) => v + 1;
    const g = () => undefined;
    const h = (v: number) => v + 3;

    expect(mCompose(f, g, h)(3)).toBe(undefined);
  });
});
