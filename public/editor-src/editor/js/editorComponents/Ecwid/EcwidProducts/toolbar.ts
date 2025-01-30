import { GetItems } from "visual/editorComponents/EditorComponent/types";
import { getColorToolbar } from "visual/utils/color";
import { t } from "visual/utils/i18n";
import { defaultValueValue } from "visual/utils/onChange";
import { Value } from "./types/Value";

export const getItems: GetItems<Value> = ({ v, device }) => {
  const dvv = (key: string) =>
    defaultValueValue({ v, key, device, state: "normal" });

  const productsBgColor = getColorToolbar(
    dvv("productsBgColorPalette"),
    dvv("productsBgColorHex"),
    dvv("productsBgColorOpacity")
  );

  return [
    {
      id: "toolbarElementProducts",
      type: "popover",
      config: { title: t("Products"), icon: "nc-woo-products" },
      devices: "desktop",
      position: 10,
      options: [
        {
          id: "tabsCurrentElement",
          type: "tabs",
          tabs: [
            {
              id: "tabCurrentElement",
              label: t("Products"),
              options: [
                {
                  id: "productName",
                  label: t("Name"),
                  type: "select",
                  choices: [
                    { value: "SHOW", title: "Show" },
                    { value: "HIDE", title: "Hide" },
                    { value: "SHOW_ON_HOVER", title: "Show On Hover" }
                  ]
                },
                {
                  id: "productSubtitle",
                  label: t("Subtitle"),
                  type: "select",
                  choices: [
                    { value: "SHOW", title: "Show" },
                    { value: "HIDE", title: "Hide" },
                    { value: "SHOW_ON_HOVER", title: "Show On Hover" }
                  ]
                },
                {
                  id: "productPrice",
                  label: t("Price"),
                  type: "select",
                  choices: [
                    { value: "SHOW", title: "Show" },
                    { value: "HIDE", title: "Hide" },
                    { value: "SHOW_ON_HOVER", title: "Show On Hover" }
                  ]
                },
                {
                  id: "productSKU",
                  label: t("SKU"),
                  type: "select",
                  choices: [
                    { value: "SHOW", title: "Show" },
                    { value: "HIDE", title: "Hide" },
                    { value: "SHOW_ON_HOVER", title: "Show On Hover" }
                  ]
                },
                {
                  id: "buyNowButton",
                  label: t("Buy now"),
                  type: "select",
                  choices: [
                    { value: "SHOW", title: "Show" },
                    { value: "HIDE", title: "Hide" },
                    { value: "SHOW_ON_HOVER", title: "Show On Hover" }
                  ]
                }
              ]
            },
            {
              id: "tabCurrentElementDisplay",
              label: t("Display"),
              options: [
                {
                  id: "productCardFrame",
                  label: t("Card frame"),
                  type: "switch"
                },
                {
                  id: "darkenImage",
                  label: t("Darken image background"),
                  type: "switch"
                },
                {
                  id: "additionalImage",
                  label: t("Additional image on hover"),
                  type: "switch"
                },
                {
                  id: "mainProductImage",
                  label: t("Main product image"),
                  type: "switch"
                },
                {
                  id: "sortingOptions",
                  label: t("Sorting Options"),
                  type: "switch"
                },
                {
                  id: "footerDisplay",
                  label: t("Footer"),
                  type: "switch"
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
              id: "tabBg",
              label: t("Bg"),
              options: [
                {
                  id: "products",
                  type: "backgroundColor"
                }
              ]
            },
            {
              id: "tabBorder",
              label: t("Border"),
              options: [
                {
                  id: "productsBorder",
                  type: "border"
                }
              ]
            },
            {
              id: "tabBoxShadow",
              label: t("Shadow"),
              options: [
                {
                  id: "productsBoxShadow",
                  type: "boxShadow"
                }
              ]
            }
          ]
        }
      ]
    },
    {
      id: "horizontalAlign",
      type: "toggle",
      disabled: true,
      choices: []
    },
    {
      id: "advancedSettings",
      type: "advancedSettings",
      position: 110,
      title: t("Settings")
    }
  ];
};
