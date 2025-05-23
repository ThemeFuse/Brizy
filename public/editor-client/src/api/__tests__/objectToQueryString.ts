import { objectToQueryString } from "../utils";

describe("Testing 'objectToQueryString' function", () => {
  const falsyValues = [[], {}];

  test.each(falsyValues)("On %p, return empty string", (value) => {
    expect(objectToQueryString(value)).toBe("");
  });

  const normalValues: {
    input: Record<string, string | number | boolean>;
    expected: string;
  }[] = [
    { input: { a: "1", b: "2" }, expected: "a=1&b=2" },
    { input: { a: "1", b: 2 }, expected: "a=1&b=2" },
    { input: { a: "1", b: true }, expected: "a=1&b=true" },
    { input: { a: "1", b: false }, expected: "a=1&b=false" },
    { input: { a: "1", b: 0 }, expected: "a=1&b=0" },
    { input: { a: "1", b: "" }, expected: "a=1&b=" },
    { input: { a: "1", b: NaN }, expected: "a=1&b=NaN" },
    { input: { a: "1", b: 2, c: 3 }, expected: "a=1&b=2&c=3" }
  ];

  test.each(normalValues)("On %p, return %p", ({ input, expected }) => {
    expect(objectToQueryString(input)).toBe(expected);
  });
});
