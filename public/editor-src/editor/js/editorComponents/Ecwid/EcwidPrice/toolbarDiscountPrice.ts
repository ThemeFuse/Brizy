import { GetItems } from "visual/editorComponents/EditorComponent/types";
import { getEcwidProducts } from "visual/utils/api";
import { getColorToolbar } from "visual/utils/color";
import { t } from "visual/utils/i18n";
import { defaultValueValue } from "visual/utils/onChange";
import { HOVER, NORMAL } from "visual/utils/stateMode";
import { discountedPriceSelector, getHeightCSSFn, getWidthCSSFn } from "./css";
import { Value } from "./types";

export const getItems: GetItems<Value> = ({ v, device, component }) => {
  const dvv = (key: string) =>
    defaultValueValue({ v, key, device, state: "normal" });

  const bgColor = getColorToolbar(
    dvv("bgThroughPriceColorPalette"),
    dvv("bgThroughPriceColorHex"),
    dvv("bgThroughPriceColorOpacity")
  );
  const style1 = dvv("priceStyle") === "style-1";

  const config = component.getGlobalConfig();

  return [
    {
      id: "toolbarCurrentShortcode",
      type: "popover",
      disabled: device !== "desktop",
      config: {
        icon: "nc-woo-price",
        title: t("Style")
      },
      position: 1,
      options: [
        {
          id: "priceStyle",
          label: t("Style"),
          type: "radioGroup",
          choices: [
            { value: "style-1", icon: "t2-shopify-price-style1" },
            { value: "style-2", icon: "t2-shopify-price-style2" },
            { value: "style-3", icon: "t2-shopify-price-style3" }
          ]
        },
        {
          id: "entityId",
          type: "select",
          label: t("Product"),
          devices: "desktop",
          placeholder: "Select",
          choices: {
            load: () => getEcwidProducts(config),
            emptyLoad: {
              title: t("There are no choices")
            }
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
      position: 8,
      options: [
        {
          id: "typographyThroughPrice",
          type: "typography",
          config: {
            fontFamily: device === "desktop"
          },
          selector: discountedPriceSelector
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
            backgroundColor: bgColor
          }
        }
      },
      position: 9,
      devices: "desktop",
      options: [
        {
          id: "tabsColor",
          type: "tabs",
          tabs: [
            {
              id: "tabBg",
              label: t("Bg"),
              options: [
                {
                  id: "discountPriceColor",
                  type: "backgroundColor",
                  states: [NORMAL, HOVER],
                  selector: discountedPriceSelector
                }
              ]
            },
            {
              id: "tabText",
              label: t("Text"),
              options: [
                {
                  id: "textColorThroughPrice",
                  type: "colorPicker",
                  states: [NORMAL, HOVER],
                  selector: discountedPriceSelector
                }
              ]
            },
            {
              id: "tabBorder",
              label: t("Border"),
              options: [
                {
                  id: "throughPriceBorder",
                  type: "border",
                  states: [NORMAL, HOVER],
                  selector: discountedPriceSelector
                }
              ]
            },
            {
              id: "tabBoxShadow",
              label: t("Shadow"),
              options: [
                {
                  id: "priceThroughSBoxShadow",
                  type: "boxShadow",
                  states: [NORMAL, HOVER],
                  selector: discountedPriceSelector
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
      position: 110,
      options: [
        {
          id: "thoughPriceWidth",
          label: t("Width"),
          type: "slider",
          config: {
            min: 0,
            max: 100,
            units: [{ value: "px", title: "px" }]
          },
          style: getWidthCSSFn(discountedPriceSelector)
        },
        {
          id: "thoughPriceHeight",
          label: t("Height"),
          type: "slider",
          config: {
            min: 0,
            max: 100,
            units: [{ value: "px", title: "px" }]
          },
          style: getHeightCSSFn(discountedPriceSelector)
        },
        {
          id: "spacing",
          label: t("Spacing"),
          type: "slider",
          disabled: !style1,
          config: {
            min: 0,
            max: 100,
            units: [{ value: "px", title: "px" }]
          },
          selector: discountedPriceSelector
        },
        {
          id: "grid",
          type: "grid",
          config: { separator: true },
          devices: "desktop",
          columns: [
            {
              id: "col-1",
              size: 1,
              options: [
                {
                  id: "styles",
                  type: "sidebarTabsButton",
                  config: {
                    tabId: "styles",
                    text: t("Styling"),
                    icon: "nc-cog"
                  }
                }
              ]
            },
            {
              id: "col-2",
              size: 1,
              options: [
                {
                  id: "effects",
                  type: "sidebarTabsButton",
                  config: {
                    tabId: "effects",
                    text: t("Effects"),
                    icon: "nc-flash"
                  }
                }
              ]
            }
          ]
        }
      ]
    }
  ];
};
