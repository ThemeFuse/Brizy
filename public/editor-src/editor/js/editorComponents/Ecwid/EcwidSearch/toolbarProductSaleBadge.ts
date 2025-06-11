import { GetItems } from "visual/editorComponents/EditorComponent/types";
import { getColorToolbar } from "visual/utils/color";
import { t } from "visual/utils/i18n";
import { defaultValueValue } from "visual/utils/onChange";
import { HOVER, NORMAL } from "visual/utils/stateMode";
import { productCardSelector } from "./css/selectors";
import { Value } from "./types";

export const getItems: GetItems<Value> = ({ v, device, state }) => {
  const dvv = (key: string) => defaultValueValue({ v, key, device, state });

  const productBadgeColor = getColorToolbar(
    dvv("productBadgeColorPalette"),
    dvv("productBadgeColorHex"),
    dvv("productBadgeColorOpacity")
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
          id: "productBadgeTypography",
          type: "typography",
          config: {
            fontFamily: device === "desktop"
          },
          selector: `${productCardSelector} .grid-product__label .ec-label.label--notice, ${productCardSelector} .grid-product__label .ec-label.label--custom`
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
            backgroundColor: productBadgeColor
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
                  id: "productBadgeColor",
                  type: "colorPicker",
                  states: [NORMAL, HOVER],
                  selector: `${productCardSelector} .grid-product__label .ec-label.label--notice, ${productCardSelector} .grid-product__label .ec-label.label--custom`
                }
              ]
            },
            {
              id: "tabBackground",
              label: t("Background"),
              options: [
                {
                  id: "productBadge",
                  type: "backgroundColor",
                  states: [NORMAL, HOVER],
                  selector: `${productCardSelector} .grid-product__label .ec-label.label--notice, ${productCardSelector} .grid-product__label .ec-label.label--custom`
                }
              ]
            },
            {
              id: "tabBorder",
              label: t("Border"),
              options: [
                {
                  id: "productBadgeBorder",
                  type: "border",
                  states: [NORMAL, HOVER],
                  selector: `${productCardSelector} .grid-product__label .ec-label.label--notice, ${productCardSelector} .grid-product__label .ec-label.label--custom`
                }
              ]
            },
            {
              id: "tabShadow",
              label: t("Shadow"),
              options: [
                {
                  id: "productBadgeBoxShadow",
                  type: "boxShadow",
                  states: [NORMAL, HOVER],
                  selector: `${productCardSelector} .grid-product__label .ec-label.label--notice, ${productCardSelector} .grid-product__label .ec-label.label--custom`
                }
              ]
            }
          ]
        }
      ]
    }
  ];
};
