import { GetItems } from "visual/editorComponents/EditorComponent/types";
import { getColorToolbar } from "visual/utils/color";
import { t } from "visual/utils/i18n";
import { defaultValueValue } from "visual/utils/onChange";
import { HOVER, NORMAL } from "visual/utils/stateMode";
import { productCardSelector } from "./css/selectors";
import { Value } from "./types";

export const getItems: GetItems<Value> = ({ v, device, state }) => {
  const dvv = (key: string) => defaultValueValue({ v, key, device, state });

  const productTitleColor = getColorToolbar(
    dvv("productTitleColorPalette"),
    dvv("productTitleColorHex"),
    dvv("productTitleColorOpacity")
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
          id: "productTitleTypography",
          type: "typography",
          config: {
            fontFamily: device === "desktop"
          },
          selector: `${productCardSelector} .grid-product__title-inner`
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
            backgroundColor: productTitleColor
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
                  id: "productTitleColor",
                  type: "colorPicker",
                  states: [NORMAL, HOVER],
                  selector: `${productCardSelector} .grid-product__title-inner`
                }
              ]
            },
            {
              id: "tabShadow",
              label: t("Shadow"),
              options: [
                {
                  id: "productTitleTextShadow",
                  type: "textShadow",
                  states: [NORMAL, HOVER],
                  selector: `${productCardSelector} .grid-product__title-inner`
                }
              ]
            }
          ]
        }
      ]
    }
  ];
};
