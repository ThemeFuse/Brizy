import { isHex, toHex } from "visual/utils/color/isHex";

describe("Testing 'isHex' function", function() {
  test("Return true on any value that starts with # and get fallowed by 3 or 6 hexazecimal values", () => {
    ["#123456", "#123", "#123ABC"].map(v => expect(isHex(v)).toBe(true));
  });

  test("Return false if value does not start with #", () => {
    ["123456", "123", "123ABC"].map(v => expect(isHex(v)).toBe(false));
  });

  test("Return false if value length is not 4 or 7", () => {
    ["#1", "#12", "#1123", "#5654123ABC"].map(v =>
      expect(isHex(v)).toBe(false)
    );
  });

  test("Return false if value contains other values then hexazecimal units", () => {
    ["#12z", "#12345t", "#13-"].map(v => expect(isHex(v)).toBe(false));
  });

  test("Return false if value is not a string type", () => {
    [undefined, null, 1, {}].map(v => expect(isHex(v)).toBe(false));
  });
});

describe("Testing 'toHex' function", function() {
  test("Return value if it is a valid hex value", () => {
    ["#123456", "#123", "#123ABC"].map(v => expect(toHex({}, v)).toBe(v));
  });

  test("Return orElse if it is not a valid hex value", () => {
    const orElse = {};
    [undefined, null, "test", 1, {}].map(v =>
      expect(toHex(orElse, v)).toBe(orElse)
    );
  });
});
