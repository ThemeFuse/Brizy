import { getColor } from "visual/utils/color";
import { t } from "visual/utils/i18n";
import { defaultValueValue } from "visual/utils/onChange";
import { ACTIVE, NORMAL } from "visual/utils/stateMode";

export function getItems({ v, device, state }) {
  const dvv = (key) => defaultValueValue({ v, key, device, state });
  const bgColor = getColor(
    dvv("bgColorPalette"),
    dvv("bgColorHex"),
    dvv("bgColorOpacity")
  );

  const secondIconName = dvv("secondIconName");
  const secondIconType = dvv("secondIconType");

  const switcherStyle = dvv("switcherStyle");

  return [
    {
      id: "toolbarCurrentShortcode",
      type: "popover",
      config: {
        icon: "nc-switcher",
        title: t("Switcher")
      },
      position: 70,
      options: [
        {
          id: "currentShortcodeSwitcher",
          type: "tabs",
          tabs: [
            {
              id: "currentShortcodeSwitcher",
              label: t("Switcher"),
              position: 10,
              options: [
                {
                  id: "switcherStyle",
                  label: t("Style"),
                  type: "radioGroup",
                  choices: [
                    { value: "style-1", icon: "nc-switcher-style-1" },
                    { value: "style-2", icon: "nc-switcher-style-2" }
                  ]
                },
                {
                  id: "spacing",
                  type: "slider",
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
                {
                  id: "secondIcon",
                  label: t("Icon"),
                  type: "iconSetter",
                  devices: "desktop",
                  config: { canDelete: true }
                },
                ...(secondIconName && secondIconType
                  ? [
                      {
                        id: "iconPosition",
                        label: t("Position"),
                        type: "radioGroup",
                        choices: [
                          { value: "left", icon: "nc-align-left" },
                          { value: "top", icon: "nc-align-top" },
                          { value: "right", icon: "nc-align-right" },
                          { value: "bottom", icon: "nc-align-bottom" }
                        ]
                      },
                      {
                        id: "groupIconSizesPicker",
                        type: "group",
                        options: [
                          {
                            id: "iconSize",
                            label: t("Size"),
                            type: "radioGroup",
                            choices: [
                              { value: "small", icon: "nc-16" },
                              { value: "medium", icon: "nc-24" },
                              { value: "large", icon: "nc-32" },
                              { value: "custom", icon: "nc-more" }
                            ]
                          },
                          {
                            id: "iconCustomSize",
                            type: "slider",
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
                        type: "slider",
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
      type: "popover",
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
          type: "typography",
          config: {
            fontFamily: "desktop" === device
          }
        }
      ]
    },
    {
      id: "toolbarColor",
      type: "popover",
      config: {
        size: "medium",
        title: t("Colors"),
        icon: {
          style: {
            backgroundColor: bgColor
          }
        }
      },
      devices: "desktop",
      roles: ["admin"],
      position: 90,
      options: [
        {
          id: "color",
          type: "tabs",
          tabs: [
            {
              id: "bg",
              label: t("Bg"),
              options: [
                {
                  id: "bgColor",
                  type: "colorPicker",
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
                  type: "colorPicker",
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
                  type: "border"
                }
              ]
            },
            {
              id: "shadow",
              label: t("Shadow"),
              options: [
                {
                  id: "boxShadow",
                  type: "boxShadow"
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
        title: t("Settings")
      },
      position: 110,
      options: [
        {
          id: "navStyle2Size",
          label: t("Size"),
          type: "slider",
          disabled: switcherStyle === "style-1",
          config: {
            min: 25,
            max: 100,
            units: [{ value: "px", title: "px" }]
          }
        },
        {
          id: "navStyle1Width",
          label: t("Width"),
          type: "slider",
          disabled: switcherStyle === "style-2",
          config: {
            min: 0,
            max: 1000,
            units: [{ value: "px", title: "px" }]
          }
        },
        {
          id: "grid",
          type: "grid",
          config: {
            separator: true
          },
          columns: [
            {
              id: "grid-settings",
              width: 50,
              options: [
                {
                  id: "styles",
                  type: "sidebarTabsButton",
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
                  type: "sidebarTabsButton",
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
