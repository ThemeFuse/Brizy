import { getColorToolbar } from "visual/utils/color";
import { t } from "visual/utils/i18n";
import { defaultValueValue } from "visual/utils/onChange";

export default (params) => ({ getItems: getItems(params) });

export const getItems =
  ({ hasDiscount, hasTwoPrices }) =>
  ({ v, device }) => {
    const dvv = (key) => defaultValueValue({ v, key, device, state: "normal" });

    const color = getColorToolbar(
      dvv("colorPalette"),
      dvv("colorHex"),
      dvv("colorOpacity")
    );

    return [
      {
        id: "toolbarWOOPrice",
        type: "popover",
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
            type: "switch",
            devices: "desktop"
          },
          {
            id: "spacing",
            label: t("Spacing"),
            type: "slider",
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
        type: "popover",
        config: {
          icon: "nc-font",
          size: device === "desktop" ? "large" : "auto",
          title: t("Typography")
        },
        position: 70,
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
                    id: "sale",
                    type: "typography",
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
                    type: "typography",
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
        type: "popover",
        config: {
          size: "auto",
          title: t("Colors"),
          icon: {
            style: {
              backgroundColor: color
            }
          }
        },
        position: 80,
        devices: "desktop",
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
                    id: "saleColor",
                    type: "colorPicker",
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
                    type: "colorPicker",
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
        position: 110
      }
    ];
  };
