import {
  defaultDevice,
  defaultValueKey2,
  defaultValueValue2,
  isDefault
} from "visual/utils/onChange/device";
import {
  defaultMode,
  DESKTOP,
  MOBILE,
  TABLET
} from "visual/utils/responsiveMode";
import { defaultState, HOVER, NORMAL } from "visual/utils/stateMode";

describe("Testing 'defaultDevice' function", () => {
  test("Should return always 'desktop'", () => {
    [undefined, null, "test", 1, {}].forEach(v =>
      expect(defaultDevice(v)).toBe("desktop")
    );
  });
});

describe("Testing 'isDefault', function", () => {
  test("Return 'false', if the value is not equal to 'desktop'", () => {
    [undefined, 1, {}, "test"].forEach(v => expect(isDefault(v)).toBe(false));
  });

  test("Return 'true', if the value is equal to 'desktop'", () => {
    expect(isDefault("desktop")).toBe(true);
    expect(isDefault(defaultDevice())).toBe(true);
  });
});

describe("Testing 'defaultValueKey2' function", function() {
  const key = "test";

  test("Always prefix the id is with device|state keys", () => {
    expect(defaultValueKey2({ key, device: TABLET })).toBe("tabletTest");

    expect(defaultValueKey2({ key, state: HOVER })).toBe("hoverTest");

    expect(defaultValueKey2({ key, device: TABLET, state: HOVER })).toBe(
      "hoverTabletTest"
    );
  });

  test("If the device is equal with default responsive mode it does not prefix", () => {
    expect(defaultValueKey2({ key, device: defaultMode() })).toBe(key);
  });

  test("If the state is equal with default state it does not prefix", () => {
    expect(defaultValueKey2({ key, state: defaultState() })).toBe(key);
  });

  test("The result key is a  string in camelCase style", () => {
    expect(defaultValueKey2({ key, device: MOBILE, state: HOVER })).toBe(
      "hoverMobileTest"
    );
  });

  test("The prefixes are added in this strict order: {state}{device}{key} => 'stateDeviceKey'", () => {
    expect(defaultValueKey2({ key, device: DESKTOP, state: HOVER })).toBe(
      "hoverTest"
    );
    expect(defaultValueKey2({ key, device: TABLET, state: HOVER })).toBe(
      "hoverTabletTest"
    );
    expect(defaultValueKey2({ key, device: MOBILE, state: HOVER })).toBe(
      "hoverMobileTest"
    );
    expect(defaultValueKey2({ key, device: TABLET, state: NORMAL })).toBe(
      "tabletTest"
    );
    expect(defaultValueKey2({ key, device: MOBILE, state: NORMAL })).toBe(
      "mobileTest"
    );
  });
});

describe("Testing 'defaultValueValue2' function", function() {
  test("Return the value by specified key, device, state", () => {
    const key = "test";
    const v = {
      test: 1,
      tabletTest: 2,
      hoverTest: 3
    };

    expect(defaultValueValue2({ v, key })).toBe(1);
    expect(defaultValueValue2({ v, key, device: TABLET })).toBe(2);
    expect(defaultValueValue2({ v, key, state: HOVER })).toBe(3);
  });

  test("If the result value from specifies device or state is null, return value from base original key", () => {
    const key = "test";
    const v = {
      test: 1,
      tabletTest: null,
      hoverTest: null,
      hoverTabletTest: null
    };

    expect(defaultValueValue2({ v, key })).toBe(1);
    expect(defaultValueValue2({ v, key, device: TABLET })).toBe(1);
    expect(defaultValueValue2({ v, key, state: HOVER })).toBe(1);
    expect(defaultValueValue2({ v, key, device: TABLET, state: HOVER })).toBe(
      1
    );
  });
});
