import { t } from "visual/utils/i18n";
import { hexToRgba } from "visual/utils/color";
import { getOptionColorHexByPalette } from "visual/utils/options";
import { defaultValueValue, defaultValueKey } from "visual/utils/onChange";
import { capitalize } from "visual/utils/string";
import { HOVER, NORMAL, ACTIVE } from "visual/utils/stateMode";

export function getItems({ v, device }) {
  const dvk = key => defaultValueKey({ key, device, state: "normal" });
  const dvv = key => defaultValueValue({ key, v, device });

  // Color
  const { hex: bgColorHex } = getOptionColorHexByPalette(
    dvv("bgColorHex"),
    dvv("bgColorPalette")
  );
  const { hex: colorHex } = getOptionColorHexByPalette(
    dvv("colorHex"),
    dvv("colorPalette")
  );

  const isVerticalMode = dvv("verticalMode") === "on";
  const navStyle = dvv("navStyle");

  return [
    {
      id: "toolbarCurrentShortcode",
      type: "popover-dev",
      config: {
        icon: "nc-tabs",
        title: t("Tabs")
      },
      position: 60,
      devices: "desktop",
      options: [
        {
          id: "currentShortcodeTabs",
          className: "",
          type: "tabs-dev",
          tabs: [
            {
              id: "currentShortcodeTab",
              label: t("Tab"),
              position: 10,
              options: [
                {
                  id: "verticalMode",
                  label: t("Orientation"),
                  type: "radioGroup-dev",
                  choices: [
                    { value: "on", icon: "nc-vertical-items" },
                    { value: "off", icon: "nc-horizontal-items" }
                  ]
                },
                {
                  id: "navStyle",
                  label: t("Style"),
                  type: "radioGroup-dev",
                  choices:
                    v.verticalMode === "off"
                      ? [
                          { value: "style-1", icon: "nc-tabs-style-2" },
                          { value: "style-2", icon: "nc-tabs-style-1" },
                          { value: "style-3", icon: "nc-tabs-style-5" }
                        ]
                      : [
                          { value: "style-1", icon: "nc-tabs-style-4" },
                          { value: "style-2", icon: "nc-tabs-style-3" },
                          { value: "style-3", icon: "nc-tabs-style-6" }
                        ]
                },
                {
                  id: "action",
                  label: t("Activate Tab"),
                  type: "select-dev",
                  devices: "desktop",
                  choices: [
                    { title: t("On Click"), value: "click" },
                    { title: t("On Hover"), value: "hover" }
                  ]
                },
                {
                  id: "spacingAfter",
                  type: "slider-dev",
                  label: t("Content Gap"),
                  disabled: navStyle !== "style-2",
                  devices: "desktop",
                  config: {
                    min: 0,
                    max: 100
                  }
                },
                {
                  id: "spacing",
                  type: "slider-dev",
                  label: t("Spacing"),
                  devices: "desktop",
                  config: {
                    min: 0,
                    max: 100
                  }
                }
              ]
            },
            {
              id: "currentShortcodeIcon",
              label: t("Icon"),
              options: [
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
                      id: dvk("iconSize"),
                      label: t("Size"),
                      type: "radioGroup",
                      choices: [
                        { value: "small", icon: "nc-16" },
                        { value: "medium", icon: "nc-24" },
                        { value: "large", icon: "nc-32" },
                        { value: "custom", icon: "nc-more" }
                      ],
                      value: dvv("iconSize"),
                      onChange: value => {
                        return {
                          [dvk("iconSize")]: value,
                          [dvk("iconCustomSize")]:
                            value !== "custom"
                              ? dvv(`icon${capitalize(value)}Size`)
                              : dvv("iconCustomSize")
                        };
                      }
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
                    max: 100
                  }
                }
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
      position: 70,
      options: [
        {
          id: "",
          type: "typography-dev",
          config: {
            fontFamily: device === "desktop"
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
            backgroundColor:
              v.bgColorOpacity > 0
                ? hexToRgba(bgColorHex, v.bgColorOpacity)
                : hexToRgba(colorHex, v.colorOpacity)
          }
        }
      },
      devices: "desktop",
      position: 90,
      options: [
        {
          id: "tabsColor",
          type: "tabs-dev",
          tabs: [
            {
              id: "bg",
              label: t("Bg"),
              options: [
                {
                  id: "bgColor",
                  type: "colorPicker-dev",
                  states: [NORMAL, HOVER, ACTIVE]
                }
              ]
            },
            {
              id: "tabText",
              label: t("Text"),
              options: [
                {
                  id: "color",
                  type: "colorPicker-dev",
                  states: [NORMAL, HOVER, ACTIVE]
                }
              ]
            },
            {
              id: "tabBorder",
              label: t("Border"),
              options: [
                {
                  id: "border",
                  type: "border-dev",
                  states: [NORMAL, HOVER, ACTIVE]
                }
              ]
            },
            {
              id: "tabBoxShadow",
              label: t("Shadow"),
              options: [
                {
                  id: "boxShadow",
                  type: "boxShadow-dev",
                  states: [NORMAL, HOVER, ACTIVE]
                }
              ]
            }
          ]
        }
      ]
    },
    {
      id: "horizontalAlign",
      type: "toggle-dev",
      devices: "desktop",
      disabled: isVerticalMode,
      position: 100,
      choices: [
        { icon: "nc-text-align-left", title: t("Align"), value: "left" },
        { icon: "nc-text-align-center", title: t("Align"), value: "center" },
        { icon: "nc-text-align-right", title: t("Align"), value: "right" },
        { icon: "nc-text-align-justify", title: t("Align"), value: "justify" }
      ]
    },
    {
      id: "verticalAlign",
      type: "toggle-dev",
      devices: "desktop",
      position: 90,
      disabled: !isVerticalMode,
      choices: [
        { icon: "nc-hrz-align-left", title: t("Align"), value: "left" },
        { icon: "nc-hrz-align-right", title: t("Align"), value: "right" }
      ]
    },
    {
      id: "advancedSettings",
      type: "advancedSettings",
      devices: "desktop",
      roles: ["admin"],
      position: 110,
      title: t("Settings"),
      icon: "nc-cog"
    }
  ];
}
