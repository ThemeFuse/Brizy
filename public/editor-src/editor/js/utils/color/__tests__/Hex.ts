import {
  is,
  fromString,
  toLonghand,
  ShortHex,
  isShorthand
} from "visual/utils/color/Hex";

describe("Testing 'is' function", function () {
  test("Return true on any value that starts with # and get fallowed by 3 or 6 hexazecimal values", () => {
    ["#123456", "#123", "#123ABC"].map((v) => expect(is(v)).toBe(true));
  });

  test("Return false if value does not start with #", () => {
    ["123456", "123", "123ABC"].map((v) => expect(is(v)).toBe(false));
  });

  test("Return false if value length is not 4 or 7", () => {
    ["#1", "#12", "#1123", "#5654123ABC"].map((v) => expect(is(v)).toBe(false));
  });

  test("Return false if value contains other values then hexazecimal units", () => {
    ["#12z", "#12345t", "#13-"].map((v) => expect(is(v)).toBe(false));
  });

  test("Return true if values are a short hex", () => {
    ["#FFF", "#000", "#aaa"].map((v) => expect(is(v)).toBe(true));
  });
});

describe("Testing 'fromString' function", function () {
  test("Return value if it is a valid hex value", () => {
    ["#123456", "#123", "#123ABC"].map((v) => expect(fromString(v)).toBe(v));
  });

  test("Return undefined if it is not a valid hex value", () => {
    ["a", "b", "#33", "#23456676456", "#34r"].map((v) =>
      expect(fromString(v)).toBe(undefined)
    );
  });
});

describe("Testing if is a shorthand of hex color", () => {
  test.each([
    [null, false],
    [undefined, false],
    [NaN, false],
    [[], false],
    [{},false],
    [123, false],
    ["asd", false],
    ["#FFFFFF", false],
    ["#000000", false],
    ["#000", true],
    ["#f60", true],
    ["#fc0", true],
    ["#f0f", true]
  ])("%s is not a hex shorthand", (hex, expected) => {
    expect(isShorthand(hex as ShortHex)).toBe(expected);
  });
});

describe("Testing conversion of shorthand hex to longhand", () => {
  test.each([
    ["#FFF", "#FFFFFF"],
    ["#000", "#000000"],
    ["#f60", "#ff6600"],
    ["#fc0", "#ffcc00"],
    ["#f0f", "#ff00ff"]
  ])("short hand of %s if not the same as %s)", (hex, expected) => {
    expect(toLonghand(hex as ShortHex)).toBe(expected);
  });
});
