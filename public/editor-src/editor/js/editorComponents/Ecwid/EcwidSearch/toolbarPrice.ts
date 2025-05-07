import { GetItems } from "visual/editorComponents/EditorComponent/types";
import { getColorToolbar } from "visual/utils/color";
import { t } from "visual/utils/i18n";
import { defaultValueValue } from "visual/utils/onChange";
import { HOVER, NORMAL } from "visual/utils/stateMode";
import { productCardSelector } from "./css/selectors";
import { Value } from "./types";

export const getItems: GetItems<Value> = ({ v, device, state }) => {
  const dvv = (key: string) => defaultValueValue({ v, key, device, state });

  const productPriceColor = getColorToolbar(
    dvv("productPriceColorPalette"),
    dvv("productPriceColorHex"),
    dvv("productPriceColorOpacity")
  );

  return [
    {
      id: "toolbarTypographyTitle",
      type: "popover",
      config: {
        icon: "nc-font",
        size: device === "desktop" ? "large" : "auto",
        title: t("Typography")
      },
      position: 10,
      options: [
        {
          id: "productPriceTypography",
          type: "typography",
          config: {
            fontFamily: device === "desktop"
          },
          selector: `${productCardSelector} .grid-product__price-value`
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
            backgroundColor: productPriceColor
          }
        }
      },
      devices: "desktop",
      position: 20,
      options: [
        {
          id: "tabsColor",
          type: "tabs",
          tabs: [
            {
              id: "tabColor",
              label: t("Color"),
              options: [
                {
                  id: "productPriceColor",
                  type: "colorPicker",
                  states: [NORMAL, HOVER],
                  selector: `${productCardSelector} .grid-product__price-value`
                }
              ]
            },
            {
              id: "tabShadow",
              label: t("Shadow"),
              options: [
                {
                  id: "productPriceTextShadow",
                  type: "textShadow",
                  states: [NORMAL, HOVER],
                  selector: `${productCardSelector} .grid-product__price-value`
                }
              ]
            }
          ]
        }
      ]
    }
  ];
};
