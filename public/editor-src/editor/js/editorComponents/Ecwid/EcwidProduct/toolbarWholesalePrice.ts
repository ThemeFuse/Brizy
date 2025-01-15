import type { GetItems } from "visual/editorComponents/EditorComponent/types";
import { getColor } from "visual/utils/color";
import { t } from "visual/utils/i18n";
import { defaultValueValue } from "visual/utils/onChange";
import { Value } from "./types/Value";

export const getItems: GetItems<Value> = ({ v, device, state }) => {
  const dvv = (key: string) => defaultValueValue({ v, key, device, state });

  const wholesalePriceColor = getColor(
    dvv("wholesalePriceColorPalette"),
    dvv("wholesalePriceColorHex"),
    dvv("wholesalePriceColorOpacity")
  );

  return [
    {
      id: "toolbarWholesalePrice",
      type: "popover",
      config: { icon: "nc-woo-price", title: t("Wholesale Price") },
      position: 10,
      devices: "desktop",
      options: [
        {
          id: "wholesalePriceColumn",
          label: t("Column"),
          type: "switch",
          devices: "desktop"
        },
        {
          id: "wholesalePriceRightSpacing",
          label: t("Spacing"),
          disabled: dvv("wholesalePriceColumn") === "on",
          type: "slider",
          config: {
            min: 0,
            max: 100,
            units: [{ value: "px", title: "px" }]
          }
        }
      ]
    },
    {
      id: "popoverTypography",
      type: "popover",
      config: {
        icon: "nc-font",
        size: device === "desktop" ? "large" : "auto",
        title: t("Typography")
      },
      position: 20,
      options: [
        {
          id: "tabsToolbarTypography",
          type: "tabs",
          tabs: [
            {
              id: "tabSale",
              label: t("Sale"),
              options: [
                {
                  id: "wholesaleTypography",
                  type: "typography",
                  config: { fontFamily: device === "desktop" }
                }
              ]
            },
            {
              id: "tabPrice",
              label: t("Price"),
              options: [
                {
                  id: "wholesalePriceTypography",
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
      config: {
        size: "medium",
        title: t("Colors"),
        icon: {
          style: {
            backgroundColor: wholesalePriceColor
          }
        }
      },
      devices: "desktop",
      position: 30,
      options: [
        {
          id: "tabsToolbarColor",
          type: "tabs",
          tabs: [
            {
              id: "saleColor",
              label: t("Sale"),
              options: [
                {
                  id: "wholesaleColor",
                  type: "colorPicker"
                }
              ]
            },
            {
              id: "colorPrice",
              label: t("Price"),
              options: [
                {
                  id: "wholesalePriceColor",
                  type: "colorPicker"
                }
              ]
            }
          ]
        }
      ]
    },
    {
      id: "wholesalePriceHorizontalAlign",
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
      devices: "desktop",
      position: 50,
      options: [
        {
          id: "wholesalePriceSpacing",
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
