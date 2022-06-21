import { defaultValueValue } from "visual/utils/onChange";
import { t } from "visual/utils/i18n";
import { hexToRgba } from "visual/utils/color";
import { getOptionColorHexByPalette } from "visual/utils/options";
import { NORMAL, ACTIVE } from "visual/utils/stateMode";

export function getItems({ v, device, state }) {
  const { hex: bgColorHex } = getOptionColorHexByPalette(
    defaultValueValue({ v, key: "bgColorHex", device, state }),
    defaultValueValue({ v, key: "bgColorPalette", device, state })
  );
  const dvv = key => defaultValueValue({ v, key, device });

  return [
    {
      id: "toolbarCurrentShortcode",
      type: "popover-dev",
      config: {
        icon: "nc-switcher",
        title: t("Switcher")
      },
      position: 70,
      options: [
        {
          id: "currentShortcodeSwitcher",
          type: "tabs-dev",
          tabs: [
            {
              id: "currentShortcodeSwitcher",
              label: t("Switcher"),
              position: 10,
              options: [
                {
                  id: "switcherStyle",
                  label: t("Style"),
                  type: "radioGroup-dev",
                  disabled: device === "tablet" || device === "mobile",
                  choices: [
                    { value: "style-1", icon: "nc-switcher-style-1" },
                    { value: "style-2", icon: "nc-switcher-style-2" }
                  ]
                },
                {
                  id: "spacing",
                  type: "slider-dev",
                  label: t("Spacing"),
                  config: {
                    min: 0,
                    max: 100,
                    units: [{ value: "px", title: "px" }]
                  }
                }
              ]
            },
            {
              id: "currentShortcodeIcon",
              devices: "desktop",
              label: t("Icon"),
              options: [
                ...(v.switcherStyle === "style-1"
                  ? []
                  : [
                      {
                        id: "firstIcon",
                        label: t("Icon"),
                        type: "iconSetter",
                        devices: "desktop",
                        canDelete: true,
                        value: {
                          name: v.firstIconName,
                          type: v.firstIconType
                        },
                        onChange: ({ name, type }) => {
                          return {
                            firstIconName: name,
                            firstIconType: type
                          };
                        }
                      }
                    ]),
                ...(v.switcherStyle === "style-1" ||
                (v.firstIconName && v.firstIconType)
                  ? [
                      {
                        id: "iconPosition",
                        label: t("Position"),
                        type: "radioGroup-dev",
                        choices: [
                          { value: "left", icon: "nc-align-left" },
                          { value: "top", icon: "nc-align-top" },
                          { value: "right", icon: "nc-align-right" },
                          { value: "bottom", icon: "nc-align-bottom" }
                        ]
                      },
                      {
                        id: "groupIconSizesPicker",
                        type: "group-dev",
                        options: [
                          {
                            id: "iconSize",
                            label: t("Size"),
                            type: "radioGroup-dev",
                            choices: [
                              { value: "small", icon: "nc-16" },
                              { value: "medium", icon: "nc-24" },
                              { value: "large", icon: "nc-32" },
                              { value: "custom", icon: "nc-more" }
                            ]
                          },
                          {
                            id: "iconCustomSize",
                            type: "slider-dev",
                            disabled: dvv("iconSize") !== "custom",
                            config: {
                              min: 8,
                              max: 50,
                              units: [{ title: "px", value: "px" }]
                            }
                          }
                        ]
                      },
                      {
                        id: "iconSpacing",
                        label: t("Spacing"),
                        type: "slider-dev",
                        config: {
                          min: 0,
                          max: 100,
                          units: [{ value: "px", title: "px" }]
                        }
                      }
                    ]
                  : [])
              ]
            }
          ]
        }
      ]
    },

    {
      id: "toolbarTypography",
      type: "popover-dev",
      config: {
        icon: "nc-font",
        size: device === "desktop" ? "large" : "auto",
        title: t("Typography")
      },
      roles: ["admin"],
      position: 70,
      options: [
        {
          id: "typography",
          type: "typography-dev",
          config: {
            fontFamily: "desktop" === device
          }
        }
      ]
    },
    {
      id: "toolbarColor",
      type: "popover-dev",
      config: {
        size: "auto",
        title: t("Colors"),
        icon: {
          style: {
            backgroundColor: hexToRgba(bgColorHex, v.bgColorOpacity)
          }
        }
      },
      devices: "desktop",
      roles: ["admin"],
      position: 90,
      options: [
        {
          id: "color",
          type: "tabs-dev",
          tabs: [
            {
              id: "bg",
              label: t("Bg"),
              options: [
                {
                  id: "bgColor",
                  type: "colorPicker-dev",
                  states: [NORMAL, ACTIVE]
                }
              ]
            },
            {
              id: "text",
              label: t("Text"),
              options: [
                {
                  id: "color",
                  type: "colorPicker-dev",
                  states: [NORMAL, ACTIVE]
                }
              ]
            },
            {
              id: "border",
              label: t("Border"),
              options: [
                {
                  id: "border",
                  type: "border-dev"
                }
              ]
            },
            {
              id: "shadow",
              label: t("Shadow"),
              options: [
                {
                  id: "boxShadow",
                  type: "boxShadow-dev"
                }
              ]
            }
          ]
        }
      ]
    },
    {
      id: "toolbarSettings",
      type: "popover-dev",
      config: {
        icon: "nc-cog",
        title: t("Settings")
      },
      position: 110,
      options: [
        {
          id: "navStyle2Size",
          label: t("Size"),
          type: "slider-dev",
          disabled: v.switcherStyle === "style-1",
          config: {
            min: 25,
            max: 100,
            units: [{ value: "px", title: "px" }]
          }
        },
        {
          id: "navStyle1Width",
          label: t("Width"),
          type: "slider-dev",
          disabled: v.switcherStyle === "style-2",
          config: {
            min: 0,
            max: 1000,
            units: [{ value: "px", title: "px" }]
          }
        },
        {
          id: "grid",
          type: "grid",
          separator: true,
          columns: [
            {
              id: "grid-settings",
              width: 50,
              options: [
                {
                  id: "styles",
                  type: "sidebarTabsButton-dev",
                  config: {
                    tabId: "styles",
                    text: t("Styling"),
                    icon: "nc-cog"
                  }
                }
              ]
            },
            {
              id: "grid-effects",
              width: 50,
              options: [
                {
                  id: "effects",
                  type: "sidebarTabsButton-dev",
                  config: {
                    tabId: "effects",
                    text: t("Effects"),
                    icon: "nc-flash"
                  }
                }
              ]
            }
          ]
        }
      ]
    }
  ];
}
