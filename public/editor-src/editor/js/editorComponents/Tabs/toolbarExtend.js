import { getColor } from "visual/utils/color";
import { t } from "visual/utils/i18n";
import { defaultValueValue } from "visual/utils/onChange";
import { ACTIVE, HOVER, NORMAL } from "visual/utils/stateMode";

export function getItems({ v, device }) {
  const dvv = (key) => defaultValueValue({ key, v, device });
  const bgColorOpacity = dvv("bgColorOpacity");
  // Color
  const bgColor = getColor(
    dvv("bgColorPalette"),
    dvv("bgColorHex"),
    bgColorOpacity
  );
  const color = getColor(
    dvv("colorPalette"),
    dvv("colorHex"),
    dvv("colorOpacity")
  );

  const isVerticalMode = dvv("verticalMode") === "on";
  const navStyle = dvv("navStyle");

  return [
    {
      id: "toolbarCurrentShortcode",
      type: "popover",
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
          type: "tabs",
          tabs: [
            {
              id: "currentShortcodeTab",
              label: t("Tab"),
              position: 10,
              options: [
                {
                  id: "verticalMode",
                  label: t("Orientation"),
                  type: "radioGroup",
                  devices: "desktop",
                  choices: [
                    { value: "on", icon: "nc-vertical-items" },
                    { value: "off", icon: "nc-horizontal-items" }
                  ]
                },
                {
                  id: "navStyle",
                  label: t("Style"),
                  type: "radioGroup",
                  devices: "desktop",
                  choices:
                    dvv("verticalMode") === "off"
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
                  type: "select",
                  devices: "desktop",
                  choices: [
                    { title: t("On Click"), value: "click" },
                    { title: t("On Hover"), value: "hover" }
                  ]
                },
                {
                  id: "spacingAfter",
                  type: "slider",
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
                  type: "slider",
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
      type: "popover",
      config: {
        icon: "nc-font",
        size: device === "desktop" ? "large" : "auto",
        title: t("Typography")
      },
      position: 70,
      options: [
        {
          id: "",
          type: "typography",
          config: {
            fontFamily: device === "desktop"
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
            backgroundColor: bgColorOpacity > 0 ? bgColor : color
          }
        }
      },
      devices: "desktop",
      position: 90,
      options: [
        {
          id: "tabsColor",
          type: "tabs",
          tabs: [
            {
              id: "bg",
              label: t("Bg"),
              options: [
                {
                  id: "bgColor",
                  type: "colorPicker",
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
                  type: "colorPicker",
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
                  type: "border",
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
                  type: "boxShadow",
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
      type: "toggle",
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
      type: "toggle",
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
      title: t("Settings")
    }
  ];
}
