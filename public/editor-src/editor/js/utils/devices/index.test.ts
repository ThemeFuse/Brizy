import * as Device from "visual/utils/devices/index";
import { desktopModes, mobileModes, types } from "visual/utils/responsiveMode";

import { testReader } from "visual/utils/types/Type.test";
import { testMonoid } from "visual/utils/types/Monoid.test";
import { testEq } from "visual/utils/types/Eq.test";

describe("Testing 'read' function", function() {
  testReader(
    Device.read,
    ["all", "desktop", "responsive"],
    [undefined, null, {}, [], 1, "test"]
  );
});

describe("Testing monoid behaviour function", function() {
  testMonoid<Device.Device>(Device, ["all", "desktop", "responsive"]);
});

describe("Testing Device Eq implementation", function() {
  testEq(Device.eq, "all", "all", "responsive");
});

describe("Testing 'devices' function", function() {
  test("Should return ['all', 'desktop', 'responsive']", () => {
    expect(Device.devices).toEqual(["all", "desktop", "responsive"]);
  });

  test("First device should be the default one", () => {
    expect(Device.devices[0]).toBe(Device.empty);
  });
});

describe("Testing 'getDevice' function", function() {
  test("Always return the 'devices' key value if it is a valid device", () => {
    Device.devices.map(device =>
      expect(Device.getDevice({ devices: device })).toBe(device)
    );
  });

  test("Always return default device if the 'devices' is not defined", () => {
    expect(Device.getDevice({})).toBe(Device.empty);
  });

  test("Always return default device if the 'devices' value is not valid", () => {
    expect(Device.getDevice({ devices: undefined })).toBe(Device.empty);
  });
});

describe("Testing 'getDevice' function", function() {
  test("Return true if the option has the device", () => {
    Device.devices.map(d =>
      expect(Device.hasDevice(d, { devices: d })).toBe(true)
    );
  });

  test("Return false if the option does not support the device", () => {
    (["all", "desktop"] as Device.Device[]).map(d =>
      expect(Device.hasDevice(d, { devices: "responsive" })).toBe(false)
    );
  });
});

describe("Testing 'supportsMode' function", function() {
  test("The 'all' devices should support all responsive modes", () => {
    types.map(mode => expect(Device.supportsMode(mode, "all")).toBe(true));
  });

  test("The 'responsive' devices should support only modes part for mobileModes()", () => {
    mobileModes().map(mode =>
      expect(Device.supportsMode(mode, "responsive")).toBe(true)
    );
    expect(Device.supportsMode("desktop", "responsive")).toBe(false);
  });

  test("The 'desktop' devices should support only modes part for desktopModes()", () => {
    desktopModes().map(mode =>
      expect(Device.supportsMode(mode, "desktop")).toBe(true)
    );
    expect(Device.supportsMode("tablet", "desktop")).toBe(false);
  });
});
