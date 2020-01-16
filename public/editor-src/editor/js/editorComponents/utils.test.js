import {
  createOptionId,
  inDevelopment,
  optionMode,
  optionState,
  setOptionPrefix
} from "./utils";
import { HOVER, NORMAL } from "visual/utils/stateMode";
import { MOBILE, TABLET, defaultMode } from "visual/utils/responsiveMode";
import { DESKTOP, RESPONSIVE } from "visual/utils/devices";

describe("Testing 'createOptionId' function", function() {
  test("The result is a string in camelCase style", () => {
    expect(createOptionId("test", "hex")).toBe("testHex");
  });

  test("If the suffix === 'value', return id without suffixing it", () => {
    expect(createOptionId("test", "value")).toBe("test");
  });
});

describe("Testing 'setOptionPrefix' function", () => {
  test("Prefix option value keys. The original key should be capitalized", () => {
    const value = {
      key1: 1,
      key2: "2",
      key3: [1, 2, 3]
    };
    const result = {
      testKey1: 1,
      testKey2: "2",
      testKey3: [1, 2, 3]
    };

    expect(setOptionPrefix("test", value)).toEqual(result);
  });

  test("If the option is not an object, then the original option is returned", () => {
    [undefined, null, "test", 1].forEach(v =>
      expect(setOptionPrefix("test", v)).toBe(v)
    );
  });

  test("If the object key is equal to 'value', prefix is used as full key", () => {
    const value = {
      key1: 1,
      value: "2",
      key3: [1, 2, 3]
    };
    const result = {
      testKey1: 1,
      test: "2",
      testKey3: [1, 2, 3]
    };

    expect(setOptionPrefix("test", value)).toEqual(result);
  });
});

describe("Testing 'inDevelopment' function", () => {
  test("Return 'true' if type name ends with '-dev'", () => {
    expect(inDevelopment("test-dev")).toBe(true);
  });

  test("Return 'false' if type name doesn't end with '-dev'", () => {
    ["", "test", "test-Dev"].forEach(type =>
      expect(inDevelopment(type)).toBe(false)
    );
  });

  test("Return 'false' for any none string value", () => {
    [undefined, null, 1, {}, () => {}].forEach(v =>
      expect(inDevelopment(v)).toBe(false)
    );
  });
});

describe("Testing 'optionState' function", function() {
  test("Return 'hover' if the option supports hover state", () => {
    expect(optionState(HOVER, { states: [NORMAL, HOVER] })).toBe(HOVER);
  });

  test("Return 'normal' if the option does not support the provided state", () => {
    expect(optionState(HOVER, { states: [NORMAL] })).toBe(NORMAL);
    expect(optionState(HOVER, { states: [] })).toBe(NORMAL);
  });
});

describe("Testing 'optionMode' function", function() {
  test("Return 'tablet' if the option supports tablet mode", () => {
    expect(optionMode(MOBILE, { devices: RESPONSIVE })).toBe(MOBILE);
  });

  test("Return 'desktop' if the option does not support the provided mode", () => {
    expect(optionMode(TABLET, { devices: DESKTOP })).toBe(DESKTOP);
    expect(optionMode(MOBILE, { devices: DESKTOP })).toBe(defaultMode());
  });
});
