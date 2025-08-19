import type { GetItems } from "visual/editorComponents/EditorComponent/types";
import { getColorToolbar } from "visual/utils/color";
import { t } from "visual/utils/i18n";
import { defaultValueValue } from "visual/utils/onChange";
import { HOVER, NORMAL } from "visual/utils/stateMode";
import { Value } from "./types/Value";

export const getItems: GetItems<Value> = ({ v, device, state }) => {
  const dvv = (key: string) => defaultValueValue({ v, key, device, state });

  const datepickerBgColor = getColorToolbar(
    dvv("datepickerBgColorPalette"),
    dvv("datepickerBgColorHex"),
    dvv("datepickerBgColorOpacity")
  );

  const isPlaceholderDisabled = dvv("datepickerPlaceholder") === "off";

  return [
    {
      id: "toolbarCurrent",
      type: "popover",
      position: 10,
      config: {
        icon: "nc-grid-45",
        title: t("Date")
      },
      options: [
        {
          id: "groupPlaceholder",
          type: "group",
          options: [
            {
              id: "datepickerPlaceholder",
              label: t("Placeholder"),
              type: "switch"
            },
            {
              id: "datepickerPlaceholderText",
              type: "inputText",
              label: t("Text"),
              devices: "desktop",
              placeholder: t("Enter custom text"),
              disabled: isPlaceholderDisabled
            }
          ]
        },
        {
          id: "datepickerSize",
          label: t("Size"),
          type: "radioGroup",
          choices: [
            { value: "small", icon: "nc-small" },
            { value: "medium", icon: "nc-medium" },
            { value: "large", icon: "nc-large" }
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
          id: "datepickerTypography",
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
            backgroundColor: datepickerBgColor
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
                  id: "datepickerColor",
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
                  id: "datepicker",
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
                  id: "datepickerBorder",
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
                  id: "datepickerBoxShadow",
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
      id: "datepickerHorizontalAlign",
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
          id: "datepickerWidth",
          label: t("Width"),
          type: "slider",
          config: {
            min: 0,
            max: 100,
            units: [{ value: "%", title: "%" }]
          }
        },
        {
          id: "datepickerSpacing",
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
