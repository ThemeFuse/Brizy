import { noop } from "underscore";
import {
  ConfigCommon,
  LeftSidebarOptionsIds,
  Mode
} from "visual/global/Config/types/configs/ConfigCommon";
import { addDefault as addDefaultLeftSidebar } from "../leftSidebar";
import { addDefault as addDefaultPopup } from "../popup";

export const configCommon: ConfigCommon = {
  branding: { name: "" },
  editorVersion: "",
  imageSizes: [],
  mode: undefined,
  postTypesTaxs: [],
  server: { maxUploadFileSize: 0 },
  taxonomies: [],
  onUpdate: noop
};

type Sidebar = Required<ConfigCommon>["ui"]["leftSidebar"];

const leftSidebarDefaultConfig: Sidebar = {
  topTabsOrder: [
    LeftSidebarOptionsIds.cms,
    LeftSidebarOptionsIds.addElements,
    LeftSidebarOptionsIds.reorderBlock,
    LeftSidebarOptionsIds.globalStyle,
    LeftSidebarOptionsIds.collaboration
  ],
  bottomTabsOrder: [
    LeftSidebarOptionsIds.deviceMode,
    LeftSidebarOptionsIds.pageSettings,
    LeftSidebarOptionsIds.more
  ],
  pageSettings: {
    options: {
      membership: true,
      language: true
    }
  },
  more: {
    options: [
      {
        type: "link",
        icon: "nc-info",
        label: "About us",
        // @ts-expect-error: Temporary
        link: undefined,
        disabled: true,
        linkTarget: "_blank"
      },
      {
        type: "link",
        icon: "nc-help-docs",
        label: "Support",
        // @ts-expect-error: temporary
        link: undefined,
        disabled: true,
        linkTarget: "_blank",
        roles: ["admin"]
      },
      {
        type: "link",
        icon: "nc-alert-circle-que",
        label: "Shortcuts",
        link: "#",
        // @ts-expect-error: temporary
        onClick: expect.any(Function)
      },
      {
        type: "link",
        icon: "nc-back",
        disabled: true,
        label: "Go to Dashboard",
        // @ts-expect-error: temporary
        link: undefined
      }
    ]
  }
};

describe("testing initConfig", () => {
  // Popup
  test.each<[ConfigCommon, ConfigCommon]>([
    // (0)
    [configCommon, configCommon],

    // (1)
    [
      { ...configCommon, mode: Mode.page },
      {
        ...configCommon,
        mode: Mode.page,
        ui: {
          popupSettings: {
            displayCondition: false,
            embedded: false,
            horizontalAlign: true,
            verticalAlign: true
          }
        }
      }
    ],

    // (2)
    [
      { ...configCommon, mode: Mode.internal_popup },
      {
        ...configCommon,
        mode: Mode.internal_popup,
        ui: {
          popupSettings: {
            displayCondition: true,
            deletePopup: true,
            embedded: false,
            horizontalAlign: true,
            verticalAlign: true
          }
        }
      }
    ],

    // (3)
    [
      { ...configCommon, mode: Mode.external_popup },
      {
        ...configCommon,
        mode: Mode.external_popup,
        ui: {
          popupSettings: {
            displayCondition: true,
            deletePopup: true,
            embedded: false,
            horizontalAlign: true,
            verticalAlign: true
          }
        }
      }
    ],

    // (4)
    [
      {
        ...configCommon,
        mode: Mode.internal_popup,
        ui: {
          popupSettings: {
            displayCondition: false,
            embedded: false,
            horizontalAlign: true,
            verticalAlign: true
          }
        }
      },
      {
        ...configCommon,
        mode: Mode.internal_popup,
        ui: {
          popupSettings: {
            displayCondition: false,
            deletePopup: true,
            embedded: false,
            horizontalAlign: true,
            verticalAlign: true
          }
        }
      }
    ],

    // (5)
    [
      {
        ...configCommon,
        mode: Mode.external_popup,
        ui: {
          popupSettings: {
            displayCondition: true,
            deletePopup: false,
            embedded: false,
            horizontalAlign: true,
            verticalAlign: true
          }
        }
      },
      {
        ...configCommon,
        mode: Mode.external_popup,
        ui: {
          popupSettings: {
            displayCondition: true,
            deletePopup: false,
            embedded: false,
            horizontalAlign: true,
            verticalAlign: true
          }
        }
      }
    ],

    // (6)
    [
      {
        ...configCommon,
        mode: Mode.external_popup,
        ui: {
          popupSettings: {}
        }
      },
      {
        ...configCommon,
        mode: Mode.external_popup,
        ui: {
          popupSettings: {
            displayCondition: true,
            deletePopup: true,
            embedded: false,
            horizontalAlign: true,
            verticalAlign: true
          }
        }
      }
    ],

    // (7)
    [
      {
        ...configCommon,
        mode: Mode.page,
        ui: {
          popupSettings: {
            displayCondition: false,
            embedded: false,
            horizontalAlign: true,
            verticalAlign: true
          },
          leftSidebar: {}
        }
      },
      {
        ...configCommon,
        mode: Mode.page,
        ui: {
          popupSettings: {
            displayCondition: false,
            embedded: false,
            horizontalAlign: true,
            verticalAlign: true
          },
          leftSidebar: {}
        }
      }
    ],

    // (8)
    [
      {
        ...configCommon,
        mode: Mode.page,
        ui: {}
      },
      {
        ...configCommon,
        mode: Mode.page,
        ui: {
          popupSettings: {
            displayCondition: false,
            embedded: false,
            horizontalAlign: true,
            verticalAlign: true
          }
        }
      }
    ],

    // (9)
    [
      {
        ...configCommon,
        mode: Mode.internal_popup,
        ui: {}
      },
      {
        ...configCommon,
        mode: Mode.internal_popup,
        ui: {
          popupSettings: {
            displayCondition: true,
            deletePopup: true,
            embedded: false,
            horizontalAlign: true,
            verticalAlign: true
          }
        }
      }
    ]
  ])("addDefaultPopup nr %#", (config, resolve) => {
    expect(addDefaultPopup(config)).toStrictEqual(resolve);
  });

  // LeftSidebar
  test.each<[ConfigCommon, ConfigCommon]>([
    // (0)
    [
      configCommon,
      {
        ...configCommon,
        ui: {
          leftSidebar: leftSidebarDefaultConfig,
          popupSettings: {
            displayCondition: false,
            embedded: false,
            horizontalAlign: true,
            verticalAlign: true
          }
        }
      }
    ],

    // (1)
    [
      {
        ...configCommon,
        ui: {
          leftSidebar: {
            topTabsOrder: [LeftSidebarOptionsIds.globalStyle]
          }
        }
      },
      {
        ...configCommon,
        ui: {
          leftSidebar: {
            ...leftSidebarDefaultConfig,
            topTabsOrder: [LeftSidebarOptionsIds.globalStyle]
          }
        }
      }
    ],

    // (2)
    [
      {
        ...configCommon,
        ui: {
          leftSidebar: {
            more: {
              options: [
                {
                  type: "link",
                  icon: "nc-info",
                  label: "About us",
                  link: "#about",
                  linkTarget: "_blank"
                }
              ]
            }
          }
        }
      },
      {
        ...configCommon,
        ui: {
          leftSidebar: {
            ...leftSidebarDefaultConfig,
            more: {
              options: [
                {
                  type: "link",
                  icon: "nc-info",
                  label: "About us",
                  link: "#about",
                  linkTarget: "_blank"
                }
              ]
            }
          }
        }
      }
    ],

    // (3),
    [
      {
        ...configCommon,
        mode: Mode.internal_story
      },
      {
        ...configCommon,
        mode: Mode.internal_story,
        ui: {
          leftSidebar: {
            ...leftSidebarDefaultConfig,
            topTabsOrder: [
              LeftSidebarOptionsIds.cms,
              LeftSidebarOptionsIds.addElements,
              LeftSidebarOptionsIds.reorderBlock,
              LeftSidebarOptionsIds.globalStyle
            ],
            bottomTabsOrder: [
              LeftSidebarOptionsIds.deviceMode,
              LeftSidebarOptionsIds.pageSettings,
              LeftSidebarOptionsIds.more
            ],
            pageSettings: {
              options: {
                language: false,
                membership: false
              }
            }
          }
        }
      }
    ],

    // (4),
    [
      { ...configCommon, mode: Mode.external_popup },
      {
        ...configCommon,
        mode: Mode.external_popup,
        ui: {
          ...configCommon.ui,
          leftSidebar: {
            ...leftSidebarDefaultConfig,
            topTabsOrder: [
              LeftSidebarOptionsIds.addElements,
              LeftSidebarOptionsIds.reorderBlock,
              LeftSidebarOptionsIds.globalStyle
            ],
            bottomTabsOrder: [
              LeftSidebarOptionsIds.deviceMode,
              LeftSidebarOptionsIds.pageSettings,
              LeftSidebarOptionsIds.more
            ],
            pageSettings: {
              options: {
                language: false,
                membership: false
              }
            }
          }
        }
      }
    ]
  ])("addDefaultLeftSidebar nr %#", (config, resolve) => {
    expect(addDefaultLeftSidebar(config)).toStrictEqual(resolve);
  });
});
