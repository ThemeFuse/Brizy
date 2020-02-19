import { t } from "visual/utils/i18n";
import { defaultValueValue, defaultValueKey } from "visual/utils/onChange";
import { hexToRgba } from "visual/utils/color";
import { getOptionColorHexByPalette } from "visual/utils/options";
import { toolbarElementWOOPriceSpacing } from "visual/utils/toolbar";

export default params => ({ getItems: getItems(params) });

export const getItems = hasDiscount => ({ v, device }) => {
  const dvv = key => defaultValueValue({ v, key, device, state: "normal" });
  const dvk = key => defaultValueKey({ key, device, state: "normal" });

  const { hex: colorHex } = getOptionColorHexByPalette(
    dvv("colorHex"),
    dvv("colorPalette")
  );

  return [
    {
      id: "toolbarWOOPrice",
      type: "popover",
      devices: "desktop",
      title: t("WOOPrice"),
      icon: "nc-woo-2",
      position: 60,
      disabled: !hasDiscount,
      options: [
        {
          id: dvk("column"),
          label: t("Column"),
          type: "switch-dev",
          devices: "desktop"
        },
        toolbarElementWOOPriceSpacing({
          v,
          device,
          devices: "desktop",
          state: "normal"
        })
      ]
    },
    {
      id: "toolbarTypography",
      type: "popover",
      icon: "nc-font",
      size: device === "desktop" ? "large" : "auto",
      title: t("Typography"),
      roles: ["admin"],
      position: 70,
      options: [
        {
          id: dvk("tabsToolbarTypography"),
          type: "tabs",
          tabs: [
            {
              id: dvk("tabSale"),
              label: t("Sale"),
              disabled: !hasDiscount,
              options: [
                {
                  id: "sale",
                  type: "typography-dev",
                  config: {
                    fontFamily: device === "desktop"
                  }
                }
              ]
            },
            {
              id: dvk("tabPrice"),
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
      id: dvk("toolbarColor"),
      type: "popover",
      size: "auto",
      title: t("Colors"),
      roles: ["admin"],
      position: 80,
      devices: "desktop",
      icon: {
        style: {
          backgroundColor: hexToRgba(colorHex, dvv("colorOpacity"))
        }
      },
      options: [
        {
          id: dvk("tabsToolbarColor"),
          type: "tabs",
          tabs: [
            {
              id: dvk("saleColor"),
              label: t("Sale"),
              disabled: !hasDiscount,
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
              id: dvk("colorPrice"),
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
