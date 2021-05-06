import { pipe } from "./pipe";

test("Testing 'pipe' function", function() {
  const increment = (n: number) => n + 1;
  const double = (n: number) => n * 2;
  const repeatThree = (s: string) => s.repeat(3);
  const toString = (v: unknown) => String(v);
  const toNumber = (v: unknown) => Number(v);

  expect(pipe(increment, double, toString)(5)).toBe("12");
  expect(pipe(repeatThree, toNumber, double)("1")).toBe(222);
});
