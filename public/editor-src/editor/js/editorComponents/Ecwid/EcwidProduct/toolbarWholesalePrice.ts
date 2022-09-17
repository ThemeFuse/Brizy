import { ToolbarItemType } from "visual/editorComponents/ToolbarItemType";
import { hexToRgba } from "visual/utils/color";
import { t } from "visual/utils/i18n";
import { defaultValueValue } from "visual/utils/onChange";
import { getOptionColorHexByPalette } from "visual/utils/options";
import { ResponsiveMode } from "visual/utils/responsiveMode";
import { State } from "visual/utils/stateMode";
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

  const { hex: wholesalePriceColorHex } = getOptionColorHexByPalette(
    dvv("wholesalePriceColorHex"),
    dvv("wholesalePriceColorPalette")
  );

  return [
    {
      id: "toolbarWholesalePrice",
      type: "popover-dev",
      config: { icon: "nc-woo-price", title: t("Wholesale Price") },
      position: 10,
      devices: "desktop",
      options: [
        {
          id: "wholesalePriceColumn",
          label: t("Column"),
          type: "switch-dev",
          devices: "desktop"
        },
        {
          id: "wholesalePriceRightSpacing",
          label: t("Spacing"),
          disabled: dvv("wholesalePriceColumn") === "on",
          type: "slider-dev",
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
      type: "popover-dev",
      config: {
        icon: "nc-font",
        size: device === "desktop" ? "large" : "auto",
        title: t("Typography")
      },
      position: 20,
      options: [
        {
          id: "tabsToolbarTypography",
          type: "tabs-dev",
          tabs: [
            {
              id: "tabSale",
              label: t("Sale"),
              options: [
                {
                  id: "wholesaleTypography",
                  type: "typography-dev",
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
                  type: "typography-dev",
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
      type: "popover-dev",
      config: {
        size: "auto",
        title: t("Colors"),
        icon: {
          style: {
            backgroundColor: hexToRgba(
              wholesalePriceColorHex,
              dvv("wholesalePriceColorOpacity")
            )
          }
        }
      },
      devices: "desktop",
      position: 30,
      options: [
        {
          id: "tabsToolbarColor",
          type: "tabs-dev",
          tabs: [
            {
              id: "saleColor",
              label: t("Sale"),
              options: [
                {
                  id: "wholesaleColor",
                  type: "colorPicker-dev"
                }
              ]
            },
            {
              id: "colorPrice",
              label: t("Price"),
              options: [
                {
                  id: "wholesalePriceColor",
                  type: "colorPicker-dev"
                }
              ]
            }
          ]
        }
      ]
    },
    {
      id: "wholesalePriceHorizontalAlign",
      type: "toggle-dev",
      position: 40,
      choices: [
        { icon: "nc-text-align-left", title: t("Align"), value: "left" },
        { icon: "nc-text-align-center", title: t("Align"), value: "center" },
        { icon: "nc-text-align-right", title: t("Align"), value: "right" }
      ]
    },
    {
      id: "toolbarSettings",
      type: "popover-dev",
      config: { icon: "nc-cog", title: t("Settings") },
      devices: "desktop",
      position: 50,
      options: [
        {
          id: "wholesalePriceSpacing",
          label: t("Spacing"),
          type: "slider-dev",
          config: {
            min: 0,
            max: 100,
            units: [{ value: "px", title: "px" }]
          }
        }
      ]
    }
  ];
}
