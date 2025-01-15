import { ToolbarItemType } from "visual/editorComponents/ToolbarItemType";
import { getColor } from "visual/utils/color";
import { t } from "visual/utils/i18n";
import { defaultValueValue } from "visual/utils/onChange";
import { ResponsiveMode } from "visual/utils/responsiveMode";
import { HOVER, NORMAL, State } from "visual/utils/stateMode";
import { Value } from "./types/Value";

export function getItems({
  v,
  device,
  state
}: {
  v: Value;
  device: ResponsiveMode;
  state: State;
}): ToolbarItemType[] {
  const dvv = (key: string) => defaultValueValue({ v, key, device, state });

  const buttonBgColor = getColor(
    dvv("buttonBgColorPalette"),
    dvv("buttonBgColorHex"),
    dvv("buttonBgColorOpacity")
  );

  return [
    {
      id: "toolbarCurrentShortcode",
      type: "popover",
      position: 10,
      config: {
        icon: "nc-button",
        title: t("Button")
      },
      options: [
        {
          id: "groupSize",
          type: "group",
          options: [
            {
              id: "buttonSize",
              label: t("Size"),
              type: "radioGroup",
              choices: [
                { value: "small", icon: "nc-small" },
                { value: "medium", icon: "nc-medium" },
                { value: "large", icon: "nc-large" },
                { value: "custom", icon: "nc-more" }
              ]
            },
            {
              id: "buttonHeight",
              label: t("Height"),
              disabled: dvv("buttonSize") !== "custom",
              type: "slider",
              config: {
                min: 0,
                max: 100,
                units: [{ value: "px", title: "px" }]
              }
            },
            {
              id: "buttonWidth",
              label: t("Width"),
              disabled: dvv("buttonSize") !== "custom",
              type: "slider",
              config: {
                min: 0,
                max: dvv("buttonWidthSuffix") === "px" ? 300 : 100,
                units: [
                  { value: "%", title: "%" },
                  { value: "px", title: "px" }
                ]
              }
            }
          ]
        }
      ]
    },
    {
      id: "popoverTypography",
      type: "popover",
      position: 20,
      config: {
        icon: "nc-font",
        size: device === "desktop" ? "large" : "auto",
        title: t("Typography")
      },
      options: [
        {
          id: "buttonTypography",
          type: "typography",
          config: { fontFamily: device === "desktop" }
        }
      ]
    },
    {
      id: "toolbarColor",
      type: "popover",
      position: 30,
      config: {
        size: "medium",
        title: t("Colors"),
        icon: {
          style: {
            backgroundColor: buttonBgColor
          }
        }
      },
      devices: "desktop",
      options: [
        {
          id: "tabsColor",
          type: "tabs",
          tabs: [
            {
              id: "tabText",
              label: t("Text"),
              options: [
                {
                  id: "buttonColor",
                  type: "colorPicker",
                  states: [NORMAL, HOVER]
                }
              ]
            },
            {
              id: "tabButtonBg",
              label: t("Bg"),
              options: [
                {
                  id: "button",
                  type: "backgroundColor",
                  states: [NORMAL, HOVER]
                }
              ]
            },
            {
              id: "tabBorder",
              label: t("Border"),
              options: [
                {
                  id: "buttonBorder",
                  type: "border",
                  states: [NORMAL, HOVER]
                }
              ]
            },
            {
              id: "tabBoxShadow",
              label: t("Shadow"),
              options: [
                {
                  id: "buttonBoxShadow",
                  type: "boxShadow",
                  states: [NORMAL, HOVER]
                }
              ]
            }
          ]
        }
      ]
    },
    {
      id: "buttonHorizontalAlign",
      type: "toggle",
      position: 40,
      choices: [
        { icon: "nc-text-align-left", title: t("Align"), value: "left" },
        { icon: "nc-text-align-center", title: t("Align"), value: "center" },
        { icon: "nc-text-align-right", title: t("Align"), value: "right" }
      ]
    },
    {
      id: "toolbarSettings",
      type: "popover",
      config: { icon: "nc-cog", title: t("Settings") },
      position: 50,
      options: [
        {
          id: "buttonSpacing",
          label: t("Spacing"),
          type: "slider",
          config: {
            min: 0,
            max: 100,
            units: [{ value: "px", title: "px" }]
          }
        },
        {
          id: "styles",
          type: "sidebarTabsButton",
          devices: "desktop",
          config: {
            tabId: "styles",
            text: t("Styling"),
            icon: "nc-cog",
            align: "left"
          }
        }
      ]
    }
  ];
}
