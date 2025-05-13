import { GetItems } from "visual/editorComponents/EditorComponent/types";
import { getColorToolbar } from "visual/utils/color";
import { t } from "visual/utils/i18n";
import { defaultValueValue } from "visual/utils/onChange";
import { HOVER, NORMAL } from "visual/utils/stateMode";
import { productCardSelector } from "./css/selectors";
import { Value } from "./types";

export const getItems: GetItems<Value> = ({ v, device, state }) => {
  const dvv = (key: string) => defaultValueValue({ v, key, device, state });

  const productSoldOutBadgeColor = getColorToolbar(
    dvv("productSoldOutBadgeColorPalette"),
    dvv("productSoldOutBadgeColorHex"),
    dvv("productSoldOutBadgeColorOpacity")
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
          id: "productSoldOutBadgeTypography",
          type: "typography",
          config: {
            fontFamily: device === "desktop"
          },
          selector: `${productCardSelector} .grid-product__label .ec-label.label--attention`
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
            backgroundColor: productSoldOutBadgeColor
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
                  id: "productSoldOutBadgeColor",
                  type: "colorPicker",
                  states: [NORMAL, HOVER],
                  selector: `${productCardSelector} .grid-product__label .ec-label.label--attention`
                }
              ]
            },
            {
              id: "tabBackground",
              label: t("Background"),
              options: [
                {
                  id: "productSoldOutBadge",
                  type: "backgroundColor",
                  states: [NORMAL, HOVER],
                  selector: `${productCardSelector} .grid-product__label .ec-label.label--attention`
                }
              ]
            },
            {
              id: "tabBorder",
              label: t("Border"),
              options: [
                {
                  id: "productSoldOutBadgeBorder",
                  type: "border",
                  states: [NORMAL, HOVER],
                  selector: `${productCardSelector} .grid-product__label .ec-label.label--attention`
                }
              ]
            },
            {
              id: "tabShadow",
              label: t("Shadow"),
              options: [
                {
                  id: "productSoldOutBadgeBoxShadow",
                  type: "boxShadow",
                  states: [NORMAL, HOVER],
                  selector: `${productCardSelector} .grid-product__label .ec-label.label--attention`
                }
              ]
            }
          ]
        }
      ]
    }
  ];
};
