import { fromNumber, is, Positive, unsafe } from "./Positive";

describe("Testing 'is' function", () => {
  const seed: Array<[number, boolean]> = [
    [-1, false],
    [-1.1, false],
    [-0, true],
    [0, true],
    [1, true],
    [1.1, true]
  ];

  test.each(seed)("On %d should be %s", (a, b) => expect(is(a)).toBe(b));
});

describe("Testing 'fromNumber' function", () => {
  const seed: Array<[number, Positive | undefined]> = [
    [-1, undefined],
    [-1.1, undefined],
    [-0, unsafe(-0)],
    [0, unsafe(0)],
    [1, unsafe(1)],
    [1.1, unsafe(1.1)]
  ];

  test.each(seed)("On %d should be %s", (a, b) =>
    expect(fromNumber(a)).toBe(b)
  );
});
