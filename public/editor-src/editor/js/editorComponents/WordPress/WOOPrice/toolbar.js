import { t } from "visual/utils/i18n";
import { defaultValueValue } from "visual/utils/onChange";
import { hexToRgba } from "visual/utils/color";
import { getOptionColorHexByPalette } from "visual/utils/options";

export default params => ({ getItems: getItems(params) });

export const getItems = ({ hasDiscount, hasTwoPrices }) => ({ v, device }) => {
  const dvv = key => defaultValueValue({ v, key, device, state: "normal" });

  const { hex: colorHex } = getOptionColorHexByPalette(
    dvv("colorHex"),
    dvv("colorPalette")
  );

  return [
    {
      id: "toolbarWOOPrice",
      type: "popover-dev",
      config: {
        icon: "nc-woo-price",
        title: t("Product Price")
      },
      devices: "desktop",
      position: 60,
      disabled: !hasTwoPrices,
      options: [
        {
          id: "column",
          label: t("Column"),
          type: "switch-dev",
          devices: "desktop"
        },
        {
          id: "spacing",
          label: t("Spacing"),
          type: "slider-dev",
          config: {
            min: 0,
            max: 20,
            units: [{ title: "px", value: "px" }]
          }
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
          id: "tabsToolbarTypography",
          type: "tabs-dev",
          tabs: [
            {
              id: "tabSale",
              label: t("Sale"),
              options: [
                {
                  id: "sale",
                  type: "typography-dev",
                  disabled: !hasDiscount,
                  config: {
                    fontFamily: device === "desktop"
                  }
                }
              ]
            },
            {
              id: "tabPrice",
              label: t("Price"),
              options: [
                {
                  id: "",
                  type: "typography-dev",
                  config: {
                    fontFamily: device === "desktop"
                  }
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
            backgroundColor: hexToRgba(colorHex, dvv("colorOpacity"))
          }
        }
      },
      position: 80,
      devices: "desktop",
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
                  id: "saleColor",
                  type: "colorPicker-dev",
                  devices: "desktop",
                  disabled: !hasDiscount
                }
              ]
            },
            {
              id: "colorPrice",
              label: t("Price"),
              options: [
                {
                  id: "color",
                  type: "colorPicker-dev",
                  devices: "desktop"
                }
              ]
            }
          ]
        }
      ]
    },
    {
      id: "advancedSettings",
      type: "advancedSettings",
      devices: "desktop",
      icon: "nc-cog",
      position: 110
    }
  ];
};
