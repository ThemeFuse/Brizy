import { DESKTOP, RESPONSIVE } from "visual/utils/devices";
import { MOBILE, TABLET, empty } from "visual/utils/responsiveMode";
import {
  createOptionId,
  flattenDefaultValue_,
  inDevelopment,
  makeToolbarPropsFromConfigDefaults,
  optionMode,
  setOptionPrefix
} from "../utils";

// region Mocks
jest.mock("visual/component/Options/types/GlobalBlock/index.tsx", () => {});
jest.mock("visual/component/Options/types/AdvancedSettings.jsx", () => {});
jest.mock("visual/component/Options/types/BlockThumbnail.jsx", () => {});
jest.mock("visual/component/Options/types/Button.jsx", () => {});
jest.mock("visual/component/Options/types/ButtonTooltip.jsx", () => {});
jest.mock("visual/component/Options/types/CheckGroup.jsx", () => {});
jest.mock("visual/component/Options/types/ColorFields.jsx", () => {});
jest.mock("visual/component/Options/types/ColorPalette2.jsx", () => {});
jest.mock("visual/component/Options/types/ColorPaletteEditor.jsx", () => {});
jest.mock("visual/component/Options/types/ColorPicker2.jsx", () => {});
jest.mock("visual/component/Options/types/FontFamily.jsx", () => {});
jest.mock("visual/component/Options/types/FontStyle.jsx", () => {});
jest.mock("visual/component/Options/types/FontStyleEditor.jsx", () => {});
jest.mock("visual/component/Options/types/FormApps.js", () => {});
jest.mock("visual/component/Options/types/GBConditions.tsx", () => {});
jest.mock("visual/component/Options/types/Grid.jsx", () => {});
jest.mock("visual/component/Options/types/Input.jsx", () => {});
jest.mock("visual/component/Options/types/IntegrationsApps.js", () => {});
jest.mock(
  "visual/component/Options/types/MultiInputPickerOptionType.js",
  () => {}
);
jest.mock("visual/component/Options/types/MultiPicker.jsx", () => {});
jest.mock("visual/component/Options/types/Popover.jsx", () => {});
jest.mock("visual/component/Options/types/PopupConditions.jsx", () => {});
jest.mock("visual/component/Options/types/PromptAddPopup.tsx", () => {});
jest.mock("visual/component/Options/types/PromptIcon.jsx", () => {});
jest.mock("visual/component/Options/types/RadioGroup.jsx", () => {});
jest.mock("visual/component/Options/types/Range2.jsx", () => {});
jest.mock("visual/component/Options/types/SavedBlock.tsx", () => {});
jest.mock("visual/component/Options/types/Select.jsx", () => {});
jest.mock("visual/component/Options/types/Stepper.jsx", () => {});
jest.mock("visual/component/Options/types/Toggle.jsx", () => {});
jest.mock("visual/component/Options/types/Tabs.jsx", () => {});
jest.mock("visual/component/Options/types/dev/Typography/index.tsx", () => ({
  Typography: {}
}));
// endregion

describe("Testing 'createOptionId' function", function () {
  test("The result is a string in camelCase style", () => {
    expect(createOptionId("test", "hex")).toBe("testHex");
  });

  test("If the suffix === 'value', return id without suffixing it", () => {
    expect(createOptionId("test", "value")).toBe("test");
  });

  test("If suffix starts with 'temp', move 'temp' before id", () => {
    expect(createOptionId("test", "tempOpacity")).toBe("tempTestOpacity");
    expect(createOptionId("test", "tempColoOpacity")).toBe(
      "tempTestColoOpacity"
    );
    expect(createOptionId("test", "tempValue")).toBe("tempTest");
  });
});

describe("Testing 'setOptionPrefix' function", () => {
  test("Prefix option value keys. The original key should be capitalized", () => {
    const value = {
      key1: 1,
      key2: "2",
      key3: "1,2,3"
    };
    const result = {
      testKey1: 1,
      testKey2: "2",
      testKey3: "1,2,3"
    };

    expect(setOptionPrefix("test", value)).toEqual(result);
  });

  test("If the object key is equal to 'value', prefix is used as full key", () => {
    const value = {
      key1: 1,
      value: "2",
      key3: "1,2,3"
    };
    const result = {
      testKey1: 1,
      test: "2",
      testKey3: "1,2,3"
    };

    expect(setOptionPrefix("test", value)).toEqual(result);
  });
});

describe("Testing 'inDevelopment' function", () => {
  test("Return 'true' if type name ends with '-dev'", () => {
    expect(inDevelopment("test-dev")).toBe(true);
  });

  test("Return 'false' if type name doesn't end with '-dev'", () => {
    ["", "test", "test-Dev"].forEach((type) =>
      expect(inDevelopment(type)).toBe(false)
    );
  });
});

describe("Testing 'optionMode' function", function () {
  test("Return 'tablet' if the option supports tablet mode", () => {
    expect(optionMode(MOBILE, { devices: RESPONSIVE })).toBe(MOBILE);
  });

  test("Return 'desktop' if the option does not support the provided mode", () => {
    expect(optionMode(TABLET, { devices: DESKTOP })).toBe(DESKTOP);
    expect(optionMode(MOBILE, { devices: DESKTOP })).toBe(empty);
  });
});

describe("Testing 'makeToolbarPropsFromConfigDefaults' function", () => {
  test.each([
    [
      "empty",
      {},
      {
        allowExtend: true,
        allowExtendFromParent: true,
        allowExtendFromChild: true,
        allowExtendFromThirdParty: true,
        allowSidebarExtend: true,
        allowSidebarExtendFromParent: true,
        allowSidebarExtendFromChild: true,
        allowSidebarExtendFromThirdParty: true
      }
    ],
    [
      "allowExtend 1",
      {
        allowExtend: true
      },
      {
        allowExtend: true,
        allowExtendFromParent: true,
        allowExtendFromChild: true,
        allowExtendFromThirdParty: true,
        allowSidebarExtend: true,
        allowSidebarExtendFromParent: true,
        allowSidebarExtendFromChild: true,
        allowSidebarExtendFromThirdParty: true
      }
    ],
    [
      "allowExtend 2",
      {
        allowExtend: false
      },
      {
        allowExtend: false,
        allowExtendFromParent: false,
        allowExtendFromChild: false,
        allowExtendFromThirdParty: false,
        allowSidebarExtend: false,
        allowSidebarExtendFromParent: false,
        allowSidebarExtendFromChild: false,
        allowSidebarExtendFromThirdParty: false
      }
    ],
    [
      "allowExtendFromParent 1",
      {
        allowExtend: false,
        allowExtendFromParent: true
      },
      {
        allowExtend: false,
        allowExtendFromParent: true,
        allowExtendFromChild: false,
        allowExtendFromThirdParty: false,
        allowSidebarExtend: false,
        allowSidebarExtendFromParent: true,
        allowSidebarExtendFromChild: false,
        allowSidebarExtendFromThirdParty: false
      }
    ],
    [
      "allowExtendFromParent 2",
      {
        allowExtend: false,
        allowExtendFromParent: true,
        allowSidebarExtendFromParent: false
      },
      {
        allowExtend: false,
        allowExtendFromParent: true,
        allowExtendFromChild: false,
        allowExtendFromThirdParty: false,
        allowSidebarExtend: false,
        allowSidebarExtendFromParent: false,
        allowSidebarExtendFromChild: false,
        allowSidebarExtendFromThirdParty: false
      }
    ],
    [
      "allowExtendFromChild 1",
      {
        allowExtend: false,
        allowExtendFromChild: true
      },
      {
        allowExtend: false,
        allowExtendFromParent: false,
        allowExtendFromChild: true,
        allowExtendFromThirdParty: false,
        allowSidebarExtend: false,
        allowSidebarExtendFromParent: false,
        allowSidebarExtendFromChild: true,
        allowSidebarExtendFromThirdParty: false
      }
    ],
    [
      "allowExtendFromChild 2",
      {
        allowExtend: false,
        allowExtendFromChild: true,
        allowSidebarExtendFromChild: false
      },
      {
        allowExtend: false,
        allowExtendFromParent: false,
        allowExtendFromChild: true,
        allowExtendFromThirdParty: false,
        allowSidebarExtend: false,
        allowSidebarExtendFromParent: false,
        allowSidebarExtendFromChild: false,
        allowSidebarExtendFromThirdParty: false
      }
    ],
    [
      "allowExtendFromThirdParty 1",
      {
        allowExtend: false,
        allowExtendFromThirdParty: true
      },
      {
        allowExtend: false,
        allowExtendFromParent: false,
        allowExtendFromChild: false,
        allowExtendFromThirdParty: true,
        allowSidebarExtend: false,
        allowSidebarExtendFromParent: false,
        allowSidebarExtendFromChild: false,
        allowSidebarExtendFromThirdParty: true
      }
    ],
    [
      "allowExtendFromThirdParty 2",
      {
        allowExtend: false,
        allowExtendFromThirdParty: true,
        allowSidebarExtendFromThirdParty: false
      },
      {
        allowExtend: false,
        allowExtendFromParent: false,
        allowExtendFromChild: false,
        allowExtendFromThirdParty: true,
        allowSidebarExtend: false,
        allowSidebarExtendFromParent: false,
        allowSidebarExtendFromChild: false,
        allowSidebarExtendFromThirdParty: false
      }
    ],
    [
      "allowSidebarExtend 1",
      {
        allowExtend: false,
        allowSidebarExtend: true
      },
      {
        allowExtend: false,
        allowExtendFromParent: false,
        allowExtendFromChild: false,
        allowExtendFromThirdParty: false,
        allowSidebarExtend: true,
        allowSidebarExtendFromParent: true,
        allowSidebarExtendFromChild: true,
        allowSidebarExtendFromThirdParty: true
      }
    ],
    [
      "allowSidebarExtend 2",
      {
        allowExtend: false,
        allowExtendFromParent: true,
        allowSidebarExtend: false
      },
      {
        allowExtend: false,
        allowExtendFromParent: true,
        allowExtendFromChild: false,
        allowExtendFromThirdParty: false,
        allowSidebarExtend: false,
        allowSidebarExtendFromParent: false,
        allowSidebarExtendFromChild: false,
        allowSidebarExtendFromThirdParty: false
      }
    ]
  ])("%s", (_testTitle, options, expected) => {
    expect(makeToolbarPropsFromConfigDefaults(options)).toEqual(expected);
  });
});

describe("Testing 'flattenDefaultValue_' function", () => {
  const flattenDefaultValue = flattenDefaultValue_(["_a", "_b", "_c"]);

  test.each([
    [
      { _a: { a: 1, b: 2 }, x: 3 },
      { a: 1, b: 2, x: 3 }
    ],
    [
      { _b: { _a: { a: 1 }, _c: { b: 2 } }, _a: { _c: { _b: { x: 3 } } } },
      { a: 1, b: 2, x: 3 }
    ]
  ])("no. %#", (defaultValue, expected) => {
    expect(flattenDefaultValue(defaultValue)).toStrictEqual(expected);
  });
});
