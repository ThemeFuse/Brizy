import { GetItems } from "visual/editorComponents/EditorComponent/types";
import { getColorToolbar } from "visual/utils/color";
import { t } from "visual/utils/i18n";
import { defaultValueValue } from "visual/utils/onChange";
import { HOVER, NORMAL } from "visual/utils/stateMode";
import { productCardSelector } from "./css/selectors";
import { Value } from "./types";

export const getItems: GetItems<Value> = ({ v, device, state }) => {
  const dvv = (key: string) => defaultValueValue({ v, key, device, state });

  const productsBgColor = getColorToolbar(
    dvv("productsBgColorPalette"),
    dvv("productsBgColorHex"),
    dvv("productsBgColorOpacity")
  );

  return [
    {
      id: "toolbarColor",
      type: "popover",
      config: {
        size: "medium",
        title: t("Colors"),
        icon: {
          style: {
            backgroundColor: productsBgColor
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
              id: "tabBackground",
              label: t("Background"),
              options: [
                {
                  id: "products",
                  type: "backgroundColor",
                  states: [NORMAL, HOVER],
                  selector: `${productCardSelector} .grid-product__wrap-inner`
                }
              ]
            },
            {
              id: "tabBorder",
              label: t("Border"),
              options: [
                {
                  id: "productsBorder",
                  type: "border",
                  states: [NORMAL, HOVER],
                  selector: `${productCardSelector} .grid-product__wrap-inner`
                }
              ]
            },
            {
              id: "tabShadow",
              label: t("Shadow"),
              options: [
                {
                  id: "productsBoxShadow",
                  type: "boxShadow",
                  states: [NORMAL, HOVER],
                  selector: `${productCardSelector} .grid-product__wrap-inner`
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
      roles: ["admin"],
      position: 110,
      title: t("Settings")
    }
  ];
};
