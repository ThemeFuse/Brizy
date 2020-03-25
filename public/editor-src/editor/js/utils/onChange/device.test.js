import {
  defaultValueKey,
  defaultValueKey2,
  defaultValueValue2
} from "visual/utils/onChange/device";
import {
  defaultMode,
  DESKTOP,
  MOBILE,
  TABLET
} from "visual/utils/responsiveMode";
import { empty as emptyState, HOVER, NORMAL } from "visual/utils/stateMode";

describe("Testing 'defaultValueKey' function", function() {
  const key = "test";

  test("Always prefix the id is with device|state keys", () => {
    expect(defaultValueKey({ key, device: TABLET })).toBe("tabletTest");

    expect(defaultValueKey({ key, state: HOVER })).toBe("hoverTest");

    expect(defaultValueKey({ key, device: TABLET, state: HOVER })).toBe(
      "hoverTabletTest"
    );
  });

  test("If the device is equal with default responsive mode it does not prefix", () => {
    expect(defaultValueKey({ key, device: defaultMode() })).toBe(key);
  });

  test("If the state is equal with default state it does not prefix", () => {
    expect(defaultValueKey({ key, state: emptyState })).toBe(key);
  });

  test("The result key is a  string in camelCase style", () => {
    expect(defaultValueKey({ key, device: MOBILE, state: HOVER })).toBe(
      "hoverMobileTest"
    );
  });

  test("If key starts with 'temp', always move the 'temp' at the start of the key", () => {
    const tempKey = "tempTest";

    expect(defaultValueKey({ key: tempKey, device: TABLET })).toBe(
      "tempTabletTest"
    );

    expect(defaultValueKey({ key: tempKey, state: HOVER })).toBe(
      "tempHoverTest"
    );

    expect(
      defaultValueKey({ key: tempKey, device: TABLET, state: HOVER })
    ).toBe("tempHoverTabletTest");
  });

  test("The prefixes are added in this strict order: {temp}{state}{device}{key} => 'tempStateDeviceKey'", () => {
    const tempKey = "tempTest";

    expect(defaultValueKey({ key, device: DESKTOP, state: HOVER })).toBe(
      "hoverTest"
    );

    expect(
      defaultValueKey({ key: tempKey, device: DESKTOP, state: HOVER })
    ).toBe("tempHoverTest");

    expect(defaultValueKey({ key, device: TABLET, state: HOVER })).toBe(
      "hoverTabletTest"
    );

    expect(
      defaultValueKey({ key: tempKey, device: TABLET, state: HOVER })
    ).toBe("tempHoverTabletTest");

    expect(defaultValueKey({ key, device: MOBILE, state: HOVER })).toBe(
      "hoverMobileTest"
    );

    expect(
      defaultValueKey({ key: tempKey, device: MOBILE, state: HOVER })
    ).toBe("tempHoverMobileTest");

    expect(defaultValueKey({ key, device: TABLET, state: NORMAL })).toBe(
      "tabletTest"
    );

    expect(
      defaultValueKey({ key: tempKey, device: TABLET, state: NORMAL })
    ).toBe("tempTabletTest");

    expect(defaultValueKey({ key, device: MOBILE, state: NORMAL })).toBe(
      "mobileTest"
    );

    expect(
      defaultValueKey({ key: tempKey, device: MOBILE, state: NORMAL })
    ).toBe("tempMobileTest");
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
    expect(defaultValueKey2({ key, state: emptyState })).toBe(key);
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

  test("If the result value from specifies device or state is null or undefined, return value from base original key", () => {
    const key = "test";
    const v = {
      test: 1,
      tabletTest: null,
      hoverTest: undefined,
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
