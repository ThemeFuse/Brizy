import { ToolbarItemType } from "visual/editorComponents/ToolbarItemType";
import { hexToRgba } from "visual/utils/color";
import { t } from "visual/utils/i18n";
import { defaultValueValue } from "visual/utils/onChange";
import { getOptionColorHexByPalette } from "visual/utils/options";
import { ResponsiveMode } from "visual/utils/responsiveMode";
import { Value } from "./types/Value";

export function getItems({
  v,
  device
}: {
  v: Value;
  device: ResponsiveMode;
}): ToolbarItemType[] {
  const dvv = (key: string) =>
    defaultValueValue({ v, key, device, state: "normal" });

  const productsBgColorOpacity = dvv("productsBgColorOpacity");
  const { hex: productsBgColorHex } = getOptionColorHexByPalette(
    dvv("productsBgColorHex"),
    dvv("productsBgColorPalette")
  );

  return [
    {
      id: "toolbarElementProducts",
      type: "popover-dev",
      config: { title: t("Products"), icon: "nc-woo-products" },
      devices: "desktop",
      position: 10,
      options: [
        {
          id: "tabsCurrentElement",
          type: "tabs-dev",
          tabs: [
            {
              id: "tabCurrentElement",
              label: t("Products"),
              options: [
                {
                  id: "productName",
                  label: t("Name"),
                  type: "select-dev",
                  choices: [
                    { value: "SHOW", title: "Show" },
                    { value: "HIDE", title: "Hide" },
                    { value: "SHOW_ON_HOVER", title: "Show On Hover" }
                  ]
                },
                {
                  id: "productSubtitle",
                  label: t("Subtitle"),
                  type: "select-dev",
                  choices: [
                    { value: "SHOW", title: "Show" },
                    { value: "HIDE", title: "Hide" },
                    { value: "SHOW_ON_HOVER", title: "Show On Hover" }
                  ]
                },
                {
                  id: "productPrice",
                  label: t("Price"),
                  type: "select-dev",
                  choices: [
                    { value: "SHOW", title: "Show" },
                    { value: "HIDE", title: "Hide" },
                    { value: "SHOW_ON_HOVER", title: "Show On Hover" }
                  ]
                },
                {
                  id: "productSKU",
                  label: t("SKU"),
                  type: "select-dev",
                  choices: [
                    { value: "SHOW", title: "Show" },
                    { value: "HIDE", title: "Hide" },
                    { value: "SHOW_ON_HOVER", title: "Show On Hover" }
                  ]
                },
                {
                  id: "buyNowButton",
                  label: t("Buy now"),
                  type: "select-dev",
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
                  type: "switch-dev"
                },
                {
                  id: "darkenImage",
                  label: t("Darken image background"),
                  type: "switch-dev"
                },
                {
                  id: "additionalImage",
                  label: t("Additional image on hover"),
                  type: "switch-dev"
                },
                {
                  id: "mainProductImage",
                  label: t("Main product image"),
                  type: "switch-dev"
                },
                {
                  id: "sortingOptions",
                  label: t("Sorting Options"),
                  type: "switch-dev"
                },
                {
                  id: "footerDisplay",
                  label: t("Footer"),
                  type: "switch-dev"
                }
              ]
            }
          ]
        }
      ]
    },
    {
      id: "toolbarColor",
      type: "popover-dev",
      config: {
        size: "auto",
        title: t("Colors"),
        icon: {
          style: {
            backgroundColor: hexToRgba(
              productsBgColorHex,
              productsBgColorOpacity
            )
          }
        }
      },
      devices: "desktop",
      position: 20,
      options: [
        {
          id: "tabsColor",
          type: "tabs-dev",
          tabs: [
            {
              id: "tabBg",
              label: t("Bg"),
              options: [
                {
                  id: "products",
                  type: "backgroundColor-dev"
                }
              ]
            },
            {
              id: "tabBorder",
              label: t("Border"),
              options: [
                {
                  id: "productsBorder",
                  type: "border-dev"
                }
              ]
            },
            {
              id: "tabBoxShadow",
              label: t("Shadow"),
              options: [
                {
                  id: "productsBoxShadow",
                  type: "boxShadow-dev"
                }
              ]
            }
          ]
        }
      ]
    },
    {
      id: "horizontalAlign",
      type: "toggle-dev",
      disabled: true,
      choices: []
    },
    {
      id: "advancedSettings",
      // @ts-expect-error old option
      type: "advancedSettings",
      position: 110,
      icon: "nc-cog",
      title: t("Settings")
    }
  ];
}
