import {
  defaultValueKey,
  defaultValueKey2,
  defaultValueValue
} from "visual/utils/onChange/device";
import {
  DESKTOP,
  MOBILE,
  TABLET,
  defaultMode
} from "visual/utils/responsiveMode";
import * as Responsive from "visual/utils/responsiveMode";
import {
  ACTIVE,
  HOVER,
  NORMAL,
  empty as emptyState
} from "visual/utils/stateMode";

describe("Testing 'defaultValueKey' function", function () {
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

describe("Testing 'defaultValueKey2' function", function () {
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

describe("Testing defaultValueValue function", () => {
  const v = {
    test: 1,
    hoverTest: 1.1,
    activeTest: 1.2,

    tabletTest: 2,
    hoverTabletTest: 2.1,
    activeTabletTest: 2.2,

    mobileTest: 3,
    hoverMobileTest: 3.1,
    activeMobileTest: 3.2
  };
  const key = "test";

  test("return the initial value", () => {
    expect(defaultValueValue({ v, key })).toBe(1);
  });

  test("return the initial value by state", () => {
    expect(
      defaultValueValue({ v, key, device: Responsive.empty, state: HOVER })
    ).toBe(1.1);
    expect(
      defaultValueValue({ v, key, device: Responsive.empty, state: ACTIVE })
    ).toBe(1.2);
  });

  test("return the initial value by device", () => {
    expect(defaultValueValue({ v, key, device: TABLET })).toBe(2);
    expect(defaultValueValue({ v, key, device: MOBILE })).toBe(3);
  });

  test("return the initial value by device and state", () => {
    expect(defaultValueValue({ v, key, device: TABLET, state: HOVER })).toBe(
      2.1
    );
    expect(defaultValueValue({ v, key, device: TABLET, state: ACTIVE })).toBe(
      2.2
    );
    expect(defaultValueValue({ v, key, device: MOBILE, state: HOVER })).toBe(
      3.1
    );
    expect(defaultValueValue({ v, key, device: MOBILE, state: ACTIVE })).toBe(
      3.2
    );
  });

  test("If in device mode key by state doesn't exist, take key by device", () => {
    const v = {
      test: 1,
      hoverTest: 1.1,
      activeTest: 1.2,

      tabletTest: 2,
      mobileTest: 3
    };
    expect(defaultValueValue({ v, key, device: TABLET, state: HOVER })).toBe(2);
    expect(defaultValueValue({ v, key, device: TABLET, state: ACTIVE })).toBe(
      2
    );
    expect(defaultValueValue({ v, key, device: MOBILE, state: HOVER })).toBe(3);
    expect(defaultValueValue({ v, key, device: MOBILE, state: ACTIVE })).toBe(
      3
    );
  });

  test("If in device mode key by state doesn't exist amd key by device doesn't exist, take original state key", () => {
    const v = {
      test: 1,
      hoverTest: 1.1,
      activeTest: 1.2
    };
    expect(defaultValueValue({ v, key, device: TABLET, state: HOVER })).toBe(
      1.1
    );
    expect(defaultValueValue({ v, key, device: TABLET, state: ACTIVE })).toBe(
      1.2
    );
    expect(defaultValueValue({ v, key, device: MOBILE, state: HOVER })).toBe(
      1.1
    );
    expect(defaultValueValue({ v, key, device: MOBILE, state: ACTIVE })).toBe(
      1.2
    );
  });

  test("If in device mode exists only original key, take original key", () => {
    const v = {
      test: 1
    };
    expect(
      defaultValueValue({ v, key, device: defaultMode(), state: HOVER })
    ).toBe(1);
    expect(
      defaultValueValue({ v, key, device: defaultMode(), state: ACTIVE })
    ).toBe(1);
    expect(defaultValueValue({ v, key, device: TABLET, state: HOVER })).toBe(1);
    expect(defaultValueValue({ v, key, device: TABLET, state: ACTIVE })).toBe(
      1
    );
    expect(defaultValueValue({ v, key, device: MOBILE, state: HOVER })).toBe(1);
    expect(defaultValueValue({ v, key, device: MOBILE, state: ACTIVE })).toBe(
      1
    );
  });
});
