import {
  ElementDefaultValue,
  ElementModel
} from "visual/component/Elements/Types";
import { ToolbarConfig } from "visual/editorComponents/EditorComponent/types";
import { ToolbarItemType } from "visual/editorComponents/ToolbarItemType";
import { createStore } from "visual/redux/store";
import { DeviceMode } from "visual/types";
import { ALL, Device, RESPONSIVE } from "visual/utils/devices";
import { flattenDefaultValue as flattenDefaultValue_ } from "visual/utils/models/flattenDefaultValue";
import {
  DESKTOP,
  MOBILE,
  ResponsiveMode,
  TABLET,
  empty
} from "visual/utils/responsiveMode";
import { Literal } from "visual/utils/types/Literal";
import {
  createOptionId,
  getOptionValueByDevice,
  getResponsiveModeByDevice,
  getToolbarData,
  inDevelopment,
  makeToolbarPropsFromConfigDefaults,
  optionMode,
  setOptionPrefix
} from "../utils";

// region Mocks
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
  test("Return 'true' if type name doesn't start with 'legacy-'", () => {
    expect(inDevelopment("test")).toBe(true);
  });

  test("Return 'false' if type name start with 'legacy-'", () => {
    expect(inDevelopment("legacy-test")).toBe(false);
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

describe("Testing 'flattenDefaultValue' function", () => {
  const flattenDefaultValue = flattenDefaultValue_([
    "content",
    "style",
    "link",
    "_a",
    "_b",
    "_c"
  ]);

  test.each<[ElementDefaultValue, ElementModel]>([
    [
      { content: { a: 1, b: 2 }, x: 3 },
      { a: 1, b: 2, x: 3 }
    ],
    [
      { style: { _a: { a: 1 }, link: { b: 2 } }, _a: { _c: { _b: { x: 3 } } } },
      { a: 1, b: 2, x: 3 }
    ]
  ])("no. %#", (defaultValue, expected) => {
    expect(flattenDefaultValue(defaultValue)).toStrictEqual(expected);
  });
});

describe("Testing 'getToolbarData' function", () => {
  const store = createStore();

  const testCase: [
    ToolbarItemType[],
    {
      defaultValue: Record<string, boolean | string | number | unknown>;
      DCKeys: Array<string>;
    }
  ][] = [
    [
      [
        {
          id: "toolbarCurrentElement",
          type: "popover",
          config: {
            icon: "nc-pin",
            title: "Map"
          },
          devices: "desktop",
          position: 90,
          options: [
            {
              id: "tabsCurrentElement",
              type: "tabs",
              tabs: [
                {
                  id: "tabCurrentElement",
                  label: "Map",
                  options: [
                    {
                      id: "address",
                      label: "Address",
                      type: "inputText",
                      placeholder: "Enter address",
                      // @ts-expect-error: use short string for population instead of instead of their placehol..
                      population: "test",
                      states: ["normal"],
                      default: {
                        value: "Chisinau"
                      }
                    },
                    {
                      id: "zoom",
                      label: "Zoom",
                      type: "slider",
                      devices: "responsive",
                      states: ["hover"],
                      // @ts-expect-error: use short string for population instead of instead of their placehol..
                      population: "",
                      default: { value: 13 }
                    }
                  ]
                }
              ]
            }
          ]
        },
        {
          id: "toolbarSettings",
          type: "popover",
          config: {
            icon: "nc-cog",
            title: "Settings"
          },
          position: 110,
          options: [
            {
              id: "size",
              label: "Width",
              type: "slider",
              position: 80,
              config: {
                min: 1,
                units: [
                  { value: "px", title: "px" },
                  { value: "%", title: "%" }
                ]
              }
            },
            {
              id: "testZeroValue",
              label: "Height",
              type: "slider",
              config: {
                min: 5,
                units: [
                  { value: "px", title: "px" },
                  { value: "%", title: "%" }
                ]
              }
            },
            {
              id: "testZeroValue",
              label: "Zoom",
              disabled: true,
              type: "slider",
              default: { value: 0 }
            },
            {
              id: "testEmptyString",
              label: "Zoom",
              type: "inputText",
              default: { value: "" }
            }
          ]
        },
        {
          id: "advancedSettings",
          type: "advancedSettings",
          devices: "desktop",
          position: 110
        }
      ],

      {
        defaultValue: {
          address: "Chisinau",
          size: 0,
          sizeSuffix: "",
          tabletZoom: 13,
          tabletZoomSuffix: "",
          mobileZoom: 13,
          mobileZoomSuffix: "",
          testZeroValue: 0,
          testZeroValueSuffix: "",
          testEmptyString: "",
          tabsCurrentElement: ""
        },
        DCKeys: ["address", "zoom"]
      }
    ],
    [
      [
        {
          id: "sidebarTabs",
          type: "sidebarTabs",
          tabs: [
            {
              id: "styles",
              title: "Styling",
              label: "Styling",
              options: [
                {
                  id: "hoverTransition",
                  label: "Hover Transition",
                  devices: "desktop",
                  position: 100,
                  type: "slider",
                  config: {
                    min: 0,
                    max: 99,
                    units: [{ title: "ms", value: "ms" }]
                  },
                  default: { value: 3 }
                }
              ]
            },
            {
              id: "effects",
              title: "Effects",
              label: "Effects",
              options: [
                {
                  id: "tabs",
                  type: "tabs",
                  config: {
                    align: "start"
                  },
                  tabs: [
                    {
                      id: "entrance",
                      label: "Entrance",
                      options: []
                    },
                    {
                      id: "tabHover",
                      label: "Hover",
                      options: [
                        {
                          id: "testString",
                          type: "inputText",
                          default: { value: "on" }
                        },
                        {
                          id: "optionDesktopDefault",
                          type: "switch",
                          default: { value: "on" }
                        },
                        {
                          id: "optionOnResponsive",
                          devices: "responsive",
                          type: "switch",
                          default: { value: "on" }
                        },
                        {
                          id: "optionOnDesktopAll",
                          devices: "all",
                          type: "switch",
                          disabled: false,
                          states: ["hover", "active"],
                          default: { value: "on" }
                        },
                        {
                          id: "optionOnDesktopImplicit",
                          devices: "desktop",
                          type: "switch",
                          default: { value: "on" }
                        },
                        // @ts-expect-error: unknown
                        {
                          id: "test",
                          devices: "desktop",
                          type: "inputText",
                          default: "test"
                        }
                      ]
                    }
                  ]
                }
              ]
            }
          ]
        }
      ],
      {
        defaultValue: {
          hoverTransition: 3,
          hoverTransitionSuffix: "",
          testString: "on",
          optionDesktopDefault: "on",
          mobileOptionOnResponsive: "on",
          tabletOptionOnResponsive: "on",
          optionOnDesktopAll: "on",
          optionOnDesktopImplicit: "on",
          test: "test",
          tabs: ""
        },
        DCKeys: []
      }
    ]
  ];

  test.each(testCase)(
    "default value & DCKeys parsing",
    (toolbarConfig, expected) => {
      const _parsedToolbarData = getToolbarData(store, toolbarConfig);
      expect(_parsedToolbarData.dv).toStrictEqual(expected.defaultValue);
      expect(_parsedToolbarData.DCKeys).toStrictEqual(expected.DCKeys);
    }
  );
});

describe("Testing 'getResponsiveModeByDevice' function", () => {
  const testCases: [
    { optionDevices?: Device; currentDevice: ResponsiveMode },
    ResponsiveMode
  ][] = [
    [{ currentDevice: DESKTOP }, DESKTOP],
    [{ currentDevice: TABLET }, TABLET],
    [{ currentDevice: MOBILE }, MOBILE],
    [{ optionDevices: DESKTOP, currentDevice: DESKTOP }, DESKTOP],
    [{ optionDevices: DESKTOP, currentDevice: TABLET }, DESKTOP],
    [{ optionDevices: DESKTOP, currentDevice: MOBILE }, DESKTOP],
    [{ optionDevices: RESPONSIVE, currentDevice: DESKTOP }, DESKTOP],
    [{ optionDevices: RESPONSIVE, currentDevice: TABLET }, TABLET],
    [{ optionDevices: RESPONSIVE, currentDevice: MOBILE }, MOBILE],
    [{ optionDevices: ALL, currentDevice: DESKTOP }, DESKTOP],
    [{ optionDevices: ALL, currentDevice: TABLET }, TABLET],
    [{ optionDevices: ALL, currentDevice: MOBILE }, MOBILE]
  ];

  test.each(testCases)("Get correct responsive mode", (props, expected) => {
    expect(getResponsiveModeByDevice(props)).toStrictEqual(expected);
  });
});

describe("Testing 'getOptionValueByDevice' function ", () => {
  const toolbarConfig: ToolbarConfig[] = [
    {
      selector: "test",
      toolbar: [
        {
          id: "tabsCurrentElement",
          type: "tabs",
          tabs: [
            {
              id: "tabCurrentElement",
              label: "Map",
              options: [
                {
                  id: "address",
                  label: "Address",
                  type: "inputText",
                  placeholder: "Enter address",
                  default: {
                    value: "Chisinau"
                  }
                },
                {
                  id: "zoom",
                  label: "Zoom",
                  type: "slider",
                  config: {
                    min: 1,
                    max: 21
                  },
                  default: {
                    value: 13
                  }
                },
                {
                  id: "country",
                  label: "country",
                  type: "inputText",
                  placeholder: "Enter country",
                  devices: "responsive",
                  default: {
                    value: "Moldova"
                  }
                }
              ]
            }
          ]
        }
      ],
      sidebar: [
        {
          id: "variant",
          label: "variant",
          type: "inputText",
          placeholder: "Enter variant",
          devices: "desktop",
          default: {
            value: "primary"
          }
        },
        {
          id: "borderStyle",
          label: "borderStyle",
          type: "inputText",
          placeholder: "Enter borderStyle",
          devices: "responsive",
          default: {
            value: "dashed"
          }
        }
      ]
    }
  ];
  const v: ElementModel = {
    address: "Chisinau",
    zoom: 13,
    tabletCountry: "Moldova",
    mobileCountry: "Moldova",
    variant: "primary"
  };
  const store = createStore();

  const testCasesByDevice: {
    input: { id: string; currentDevice: DeviceMode };
    result: Literal;
  }[] = [
    {
      input: {
        id: "address",
        currentDevice: "desktop"
      },
      result: "Chisinau"
    },

    {
      input: {
        id: "variant",
        currentDevice: "tablet"
      },
      result: "primary"
    },
    {
      input: {
        id: "borderStyle",
        currentDevice: "desktop"
      },
      result: ""
    },
    {
      input: {
        id: "zoom",
        currentDevice: "mobile"
      },
      result: 13
    },
    {
      input: {
        id: "zoom",
        currentDevice: "tablet"
      },
      result: 13
    },
    {
      input: {
        id: "zoom",
        currentDevice: "desktop"
      },
      result: 13
    },
    {
      input: {
        id: "country",
        currentDevice: "desktop"
      },
      result: ""
    },
    {
      input: {
        id: "country",
        currentDevice: "tablet"
      },
      result: "Moldova"
    },
    {
      input: {
        id: "country",
        currentDevice: "mobile"
      },
      result: "Moldova"
    }
  ];

  test.each(testCasesByDevice)("getValueByDevice", ({ input, result }) => {
    const { value } =
      getOptionValueByDevice({ ...input, v, toolbarConfig, store }) ?? {};

    expect(value).toStrictEqual(result);
  });
});
