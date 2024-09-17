import { is, fromString } from "visual/utils/color/Hex";

describe("Testing 'is' function", function() {
  test("Return true on any value that starts with # and get fallowed by 3 or 6 hexazecimal values", () => {
    ["#123456", "#123", "#123ABC"].map(v => expect(is(v)).toBe(true));
  });

  test("Return false if value does not start with #", () => {
    ["123456", "123", "123ABC"].map(v => expect(is(v)).toBe(false));
  });

  test("Return false if value length is not 4 or 7", () => {
    ["#1", "#12", "#1123", "#5654123ABC"].map(v => expect(is(v)).toBe(false));
  });

  test("Return false if value contains other values then hexazecimal units", () => {
    ["#12z", "#12345t", "#13-"].map(v => expect(is(v)).toBe(false));
  });
});

describe("Testing 'fromString' function", function() {
  test("Return value if it is a valid hex value", () => {
    ["#123456", "#123", "#123ABC"].map(v => expect(fromString(v)).toBe(v));
  });

  test("Return undefined if it is not a valid hex value", () => {
    ["a", "b", "#33", "#23456676456", "#34r"].map(v =>
      expect(fromString(v)).toBe(undefined)
    );
  });
});
