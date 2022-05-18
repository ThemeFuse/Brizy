import { match } from "./match";

describe("Testing 'match' function", () => {
  type A = { a: string };
  const isA = (t: ABC): t is A => "a" in t;

  type B = { b: number };
  const isB = (t: ABC): t is B => "b" in t;

  type C = { c: string[] };
  const isC = (t: ABC): t is C => "c" in t;

  type ABC = A | B | C;

  const abcId: (v: ABC) => A["a"] | B["b"] | C["c"] = match(
    [isA, v => v.a],
    [isB, v => v.b],
    [isC, v => v.c]
  );

  test("On matchC({a: 'test'}), should return 'test'", () => {
    expect(abcId({ a: "test" })).toBe("test");
  });

  test("On matchC({b: 30}), should return 30", () => {
    expect(abcId({ b: 30 })).toBe(30);
  });

  test("On matchC({c: ['test']}), should return ['test']", () => {
    expect(abcId({ c: ["test"] })).toStrictEqual(["test"]);
  });
});
