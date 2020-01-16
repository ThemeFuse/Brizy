import {
  ALL,
  DESKTOP,
  RESPONSIVE,
  defaultDevice,
  devices,
  toDevice,
  isDevice,
  getDevice,
  hasDevice,
  supportsMode
} from "visual/utils/devices/index";
import {
  desktopModes,
  mobileModes,
  modes,
  TABLET
} from "visual/utils/responsiveMode";

describe("Testing 'defaultDevice' function", function() {
  test("Should return 'all'", () => {
    expect(defaultDevice()).toBe(ALL);
  });
});

describe("Testing 'devices' function", function() {
  test("Should return ['all', 'desktop', 'responsive']", () => {
    expect(devices()).toEqual([ALL, DESKTOP, RESPONSIVE]);
  });

  test("First device should be the default one", () => {
    expect(devices()[0]).toBe(defaultDevice());
  });
});

describe("Testing 'isDevice' function", function() {
  test("Return true for valid devices", () => {
    devices().map(device => expect(isDevice(device)).toBe(true));
  });

  test("Return false for none device values", () => {
    ["test", 1, {}, undefined, null].map(v => expect(isDevice(v)).toBe(false));
  });
});

describe("Testing 'toDevice' function", function() {
  test("Always return the value if is a valid device", () => {
    devices().map(device => expect(toDevice(device)).toBe(device));
  });

  test("Always return default device if the value is not a valid device", () => {
    ["test", 1, {}, undefined, null].map(v =>
      expect(toDevice(v)).toBe(defaultDevice())
    );
  });
});

describe("Testing 'getDevice' function", function() {
  test("Always return the 'devices' key value if it is a valid device", () => {
    devices().map(device =>
      expect(getDevice({ devices: device })).toBe(device)
    );
  });

  test("Always return default device if the option is not an object", () => {
    expect(getDevice()).toBe(defaultDevice());
    expect(getDevice(null)).toBe(defaultDevice());
    expect(getDevice("test")).toBe(defaultDevice());
  });

  test("Always return default device if the 'devices' is not defined", () => {
    expect(getDevice({})).toBe(defaultDevice());
  });

  test("Always return default device if the 'devices' value is not valid", () => {
    expect(getDevice({ devices: "test" })).toBe(defaultDevice());
    expect(getDevice({ devices: 1 })).toBe(defaultDevice());
    expect(getDevice({ devices: undefined })).toBe(defaultDevice());
    expect(getDevice({ devices: null })).toBe(defaultDevice());
  });
});

describe("Testing 'getDevice' function", function() {
  test("Return true if the option has the device", () => {
    devices().map(d => expect(hasDevice(d, { devices: d })).toBe(true));
  });

  test("Return false if the option does not support the device", () => {
    [ALL, DESKTOP].map(d =>
      expect(hasDevice(d, { devices: RESPONSIVE })).toBe(false)
    );
  });
});

describe("Testing 'supportsMode' function", function() {
  test("The 'all' devices should support all responsive modes", () => {
    modes().map(mode => expect(supportsMode(mode, ALL)).toBe(true));
  });

  test("The 'responsive' devices should support only modes part for mobileModes()", () => {
    mobileModes().map(mode =>
      expect(supportsMode(mode, RESPONSIVE)).toBe(true)
    );
    expect(supportsMode(DESKTOP, RESPONSIVE)).toBe(false);
  });

  test("The 'desktop' devices should support only modes part for desktopModes()", () => {
    desktopModes().map(mode => expect(supportsMode(mode, DESKTOP)).toBe(true));
    expect(supportsMode(TABLET, DESKTOP)).toBe(false);
  });
});
