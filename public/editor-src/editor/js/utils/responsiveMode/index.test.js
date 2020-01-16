import {
  defaultMode,
  DESKTOP,
  desktopModes,
  isDesktop,
  isMobile,
  isMode,
  MOBILE,
  mobileModes,
  modes,
  TABLET,
  toMode
} from "visual/utils/responsiveMode/index";

describe("Testing 'defaultMode' function", function() {
  test("Should return 'desktop'", () => {
    expect(defaultMode()).toBe(DESKTOP);
  });
});

describe("Testing 'modes' function", function() {
  test("Should return ['desktop', 'tablet', 'mobile']", () => {
    expect(modes()).toEqual([DESKTOP, TABLET, MOBILE]);
  });

  test("First mode should be the default one", () => {
    expect(modes()[0]).toBe(defaultMode());
  });
});

describe("Testing 'isMode' function", function() {
  test("Return true for valid mode values", () => {
    modes().map(mode => expect(isMode(mode)).toBe(true));
  });

  test("Return false for invalid mode values", () => {
    ["test", 1, {}, undefined, null].map(mode =>
      expect(isMode(mode)).toBe(false)
    );
  });
});

describe("Testing 'toMode' function", function() {
  test("Always return the value if is a valid mode", () => {
    modes().map(device => expect(toMode(device)).toBe(device));
  });

  test("Always return default mode if the value is not a valid mode", () => {
    ["test", 1, {}, undefined, null].map(v =>
      expect(toMode(v)).toBe(defaultMode())
    );
  });
});

describe("Testing 'mobileModes' function", function() {
  test("Should return ['tablet', 'mobile']", () => {
    expect(mobileModes()).toEqual([TABLET, MOBILE]);
  });
});

describe("Testing 'isMobile' function", function() {
  test("Return true if the mode is part of mobileModes()", () => {
    mobileModes().map(mode => expect(isMobile(mode)).toBe(true));
  });

  test("Return false if the mode is not a part of mobileModes()", () => {
    expect(isMobile(DESKTOP)).toBe(false);
  });
});

describe("Testing 'desktopModes' function", function() {
  test("Should return ['desktop']", () => {
    expect(desktopModes()).toEqual([DESKTOP]);
  });
});

describe("Testing 'isDesktop' function", function() {
  test("Return true if the mode is part of desktopModes()", () => {
    desktopModes().map(mode => expect(isDesktop(mode)).toBe(true));
  });

  test("Return false if the mode is not a part of desktopModes()", () => {
    expect(isDesktop(TABLET)).toBe(false);
    expect(isDesktop(MOBILE)).toBe(false);
  });
});
