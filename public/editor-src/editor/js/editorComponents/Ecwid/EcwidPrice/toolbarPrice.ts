import { GetItems } from "visual/editorComponents/EditorComponent/types";
import { DCTypes } from "visual/global/Config/types/DynamicContent";
import { getEcwidProducts } from "visual/utils/api";
import { getColorToolbar } from "visual/utils/color";
import { t } from "visual/utils/i18n";
import { defaultValueValue } from "visual/utils/onChange";
import { getDynamicContentOption } from "visual/utils/options";
import { HOVER, NORMAL } from "visual/utils/stateMode";
import {
  getHeightCSSFn,
  getSpacingCSSFn,
  getWidthCSSFn,
  priceSelector
} from "./css";
import { Value } from "./types";

export const getItems: GetItems<Value> = ({
  v,
  device,
  component,
  context
}) => {
  const dvv = (key: string) =>
    defaultValueValue({ v, key, device, state: "normal" });

  const bgColor = getColorToolbar(
    dvv("bgPriceColorPalette"),
    dvv("bgPriceColorHex"),
    dvv("bgPriceColorOpacity")
  );

  const priceStyle = dvv("priceStyle");
  const style1 = priceStyle === "style-1";

  const config = component.getGlobalConfig();

  const richTextDC = getDynamicContentOption({
    options: context.dynamicContent.config,
    type: DCTypes.richText,
    config: { iconOnly: true }
  });

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
        size: device === "desktop" ? "xlarge" : "auto",
        title: t("Typography")
      },
      position: 8,
      options: [
        {
          id: "gridTypography",
          type: "grid",
          config: { separator: true },
          columns: [
            {
              id: "col-1",
              size: 1,
              align: "center",
              options: [
                {
                  id: "typographyPrice",
                  type: "typography",
                  config: {
                    fontFamily: device === "desktop"
                  },
                  selector: priceSelector
                }
              ]
            },
            {
              id: "col-2",
              size: "auto",
              align: "center",
              options: [
                {
                  id: "text",
                  devices: "desktop",
                  type: "population",
                  config: richTextDC
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
                  id: "priceColor",
                  type: "backgroundColor",
                  states: [NORMAL, HOVER],
                  selector: priceSelector
                }
              ]
            },
            {
              id: "tabText",
              label: t("Text"),
              options: [
                {
                  id: "textColorPrice",
                  type: "colorPicker",
                  states: [NORMAL, HOVER],
                  selector: priceSelector
                }
              ]
            },
            {
              id: "tabBorder",
              label: t("Border"),
              options: [
                {
                  id: "priceBorder",
                  type: "border",
                  states: [NORMAL, HOVER],
                  selector: priceSelector
                }
              ]
            },
            {
              id: "tabBoxShadow",
              label: t("Shadow"),
              options: [
                {
                  id: "priceSBoxShadow",
                  type: "boxShadow",
                  states: [NORMAL, HOVER],
                  selector: priceSelector
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
          id: "priceWidth",
          label: t("Width"),
          type: "slider",
          config: {
            min: 0,
            max: 100,
            units: [{ value: "px", title: "px" }]
          },
          style: getWidthCSSFn(priceSelector)
        },
        {
          id: "priceHeight",
          label: t("Height"),
          type: "slider",
          config: {
            min: 0,
            max: 100,
            units: [{ value: "px", title: "px" }]
          },
          style: getHeightCSSFn(priceSelector)
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
          style: getSpacingCSSFn(priceStyle)
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
