import type { GetItems } from "visual/editorComponents/EditorComponent/types";
import { getColor } from "visual/utils/color";
import { t } from "visual/utils/i18n";
import { defaultValueValue } from "visual/utils/onChange";
import { HOVER, NORMAL } from "visual/utils/stateMode";
import { Value } from "./types/Value";

export const getItems: GetItems<Value> = ({ v, device, state }) => {
  const dvv = (key: string) => defaultValueValue({ v, key, device, state });

  const filesBgColor = getColor(
    dvv("filesBgColorPalette"),
    dvv("filesBgColorHex"),
    dvv("filesBgColorOpacity")
  );

  return [
    {
      id: "toolbarCurrentShortcode",
      type: "popover",
      position: 10,
      config: {
        icon: "nc-update",
        title: t("Files")
      },
      options: [
        {
          id: "groupSize",
          type: "group",
          options: [
            {
              id: "filesSize",
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
              id: "filesHeight",
              label: t("Height"),
              disabled: dvv("filesSize") !== "custom",
              type: "slider",
              config: {
                min: 0,
                max: 100,
                units: [{ value: "px", title: "px" }]
              }
            },
            {
              id: "filesWidth",
              label: t("Width"),
              disabled: dvv("filesSize") !== "custom",
              type: "slider",
              config: {
                min: 0,
                max: 100,
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
          id: "filesTypography",
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
      position: 30,
      config: {
        size: "auto",
        title: t("Colors"),
        icon: {
          style: {
            backgroundColor: filesBgColor
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
                  id: "filesColor",
                  type: "colorPicker",
                  states: [NORMAL, HOVER]
                }
              ]
            },
            {
              id: "tabBg",
              label: t("Bg"),
              options: [
                {
                  id: "files",
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
                  id: "filesBorder",
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
                  id: "filesBoxShadow",
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
      id: "filesHorizontalAlign",
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
          id: "filesSpacing",
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
};
