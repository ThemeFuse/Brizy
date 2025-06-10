import type { GetItems } from "visual/editorComponents/EditorComponent/types";
import { getColorToolbar } from "visual/utils/color";
import { t } from "visual/utils/i18n";
import { defaultValueValue } from "visual/utils/onChange";
import { HOVER, NORMAL } from "visual/utils/stateMode";
import { productCardSelector } from "./css/selectors";
import type { Value } from "./types";

export const getItems: GetItems<Value> = ({ v, device, state }) => {
  const dvv = (key: string) => defaultValueValue({ v, key, device, state });

  const priceLabelColor = getColorToolbar(
    dvv("priceLabelColorPalette"),
    dvv("priceLabelColorHex"),
    dvv("priceLabelColorOpacity")
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
          id: "priceLabelTypography",
          type: "typography",
          config: {
            fontFamily: device === "desktop"
          },
          selector: `${productCardSelector} .grid-product__price-compare .grid-product__textblock.grid-product__price-label`
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
            backgroundColor: priceLabelColor
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
                  id: "priceLabelColor",
                  type: "colorPicker",
                  states: [NORMAL, HOVER],
                  selector: `${productCardSelector} .grid-product__price-compare .grid-product__textblock.grid-product__price-label`
                }
              ]
            },
            {
              id: "tabShadow",
              label: t("Shadow"),
              options: [
                {
                  id: "priceLabelTextShadow",
                  type: "textShadow",
                  states: [NORMAL, HOVER],
                  selector: `${productCardSelector} .grid-product__price-compare .grid-product__textblock.grid-product__price-label`
                }
              ]
            }
          ]
        }
      ]
    }
  ];
};
