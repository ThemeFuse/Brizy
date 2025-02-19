import type { GetItems } from "visual/editorComponents/EditorComponent/types";
import { getColorToolbar } from "visual/utils/color";
import { t } from "visual/utils/i18n";
import { defaultValueValue } from "visual/utils/onChange";
import { Value } from "./types/Value";

export const getItems: GetItems<Value> = ({ v, device, state }) => {
  const dvv = (key: string) => defaultValueValue({ v, key, device, state });

  const radioBgColor = getColorToolbar(
    dvv("radioBgColorPalette"),
    dvv("radioBgColorHex"),
    dvv("radioBgColorOpacity")
  );

  return [
    {
      id: "toolbarCurrentShortcode",
      type: "popover",
      position: 10,
      config: {
        icon: "nc-check-circle-on",
        title: t("Radio")
      },
      options: [
        {
          id: "columnGroup",
          type: "group",
          options: [
            {
              id: "radioColumnSwitch",
              type: "switch",
              label: t("Columns")
            },
            {
              id: "radioColumns",
              label: t("Type"),
              disabled: dvv("radioColumnSwitch") === "off",
              type: "select",
              choices: [
                { title: "1", value: 1 },
                { title: "2", value: 2 },
                { title: "3", value: 3 },
                { title: "4", value: 4 },
                { title: "5", value: 5 },
                { title: "6", value: 6 }
              ]
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
          id: "tabsToolbarTypography",
          type: "tabs",
          tabs: [
            {
              id: "tabRadio",
              label: t("Text"),
              options: [
                {
                  id: "radioTypography",
                  type: "typography",
                  config: { fontFamily: device === "desktop" }
                }
              ]
            },
            {
              id: "tabSurcharge",
              label: t("Surcharge"),
              options: [
                {
                  id: "surchargeTypography",
                  type: "typography",
                  config: { fontFamily: device === "desktop" }
                }
              ]
            }
          ]
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
            backgroundColor: radioBgColor
          }
        }
      },
      devices: "desktop",
      options: [
        {
          id: "tabsToolbarColor",
          type: "tabs",
          tabs: [
            {
              id: "radioColor",
              label: t("Text"),
              options: [
                {
                  id: "radioBgColor",
                  type: "colorPicker"
                }
              ]
            },
            {
              id: "surchargeColor",
              label: t("Surcharge"),
              options: [
                {
                  id: "surchargeColor",
                  type: "colorPicker"
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
      config: { icon: "nc-cog", title: t("Settings") },
      position: 40,
      options: [
        {
          id: "radioSpacing",
          label: t("Spacing"),
          type: "slider",
          config: {
            min: 0,
            max: 100,
            units: [{ value: "px", title: "px" }]
          }
        }
      ]
    }
  ];
};
