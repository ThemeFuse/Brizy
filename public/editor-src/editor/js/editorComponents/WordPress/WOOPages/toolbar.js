import { hexToRgba } from "visual/utils/color";
import { t } from "visual/utils/i18n";
import { defaultValueValue } from "visual/utils/onChange";
import { getOptionColorHexByPalette } from "visual/utils/options";
import { HOVER, NORMAL } from "visual/utils/stateMode";

export default (taxonomies) => {
  return {
    getItems: getItems(taxonomies)
  };
};

const getItems =
  (taxonomies) =>
  ({ v, device }) => {
    const dvv = (key) => defaultValueValue({ v, key, device });

    const { hex: bgColorHex } = getOptionColorHexByPalette(
      dvv("bgColorHex"),
      dvv("bgColorPalette")
    );

    const shortcode = dvv("shortcode");
    const disShortcodeProd = shortcode !== "products";

    return [
      {
        id: "toolbarWOOPages",
        type: "popover-dev",
        config: {
          icon: "nc-woo-pages",
          title: t("Shop Pages")
        },
        devices: "desktop",
        position: 10,
        options: [
          {
            id: "shortcode",
            label: t("Page"),
            type: "select-dev",
            devices: "desktop",
            choices: [
              { title: t("Cart"), value: "woocommerce_cart" },
              { title: t("Checkout"), value: "woocommerce_checkout" },
              { title: t("My Account"), value: "woocommerce_my_account" },
              {
                title: t("Order Tracking"),
                value: "woocommerce_order_tracking"
              },
              { title: t("Product"), value: "product" },
              { title: t("Products"), value: "products" }
            ]
          },
          {
            id: "productID",
            label: t("Product ID"),
            type: "inputText-dev",
            devices: "desktop",
            disabled: shortcode !== "product",
            placeholder: t("Product ID or SKU")
          },
          {
            id: "columns",
            label: t("Columns"),
            type: "slider-dev",
            devices: "desktop",
            disabled: disShortcodeProd,
            config: {
              min: 1,
              max: 6,
              inputMin: 1,
              inputMax: 6
            }
          },
          {
            id: "limit",
            label: t("Products Count"),
            type: "inputText-dev",
            devices: "desktop",
            disabled: disShortcodeProd,
            config: {
              size: "short"
            }
          },
          {
            id: "category",
            label: t("Categories"),
            type: "select-dev",
            devices: "desktop",
            disabled: disShortcodeProd,
            choices: [
              {
                title: t("All"),
                value: ""
              },
              ...taxonomies.map((item) => ({
                title: item.name,
                value: item.slug
              }))
            ]
          },
          {
            id: "orderBy",
            label: t("Filter By"),
            type: "select-dev",
            devices: "desktop",
            disabled: disShortcodeProd,
            choices: [
              { title: t("Random"), value: "name" },
              { title: t("Title"), value: "title" },
              { title: t("Date"), value: "date" },
              { title: t("Rating"), value: "rating" },
              { title: t("Popularity"), value: "popularity" },
              { title: t("Menu Order"), value: "menu_order" },
              { title: t("Random"), value: "rand" },
              { title: t("ID"), value: "id" }
            ]
          },
          {
            id: "order",
            label: t("Order"),
            type: "radioGroup-dev",
            devices: "desktop",
            disabled: disShortcodeProd,
            choices: [
              { value: "ASC", icon: "nc-up" },
              { value: "DESC", icon: "nc-down" }
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
              backgroundColor: hexToRgba(bgColorHex, dvv("bgColorOpacity"))
            }
          }
        },
        position: 90,
        options: [
          {
            id: "tabsColor",
            type: "tabs-dev",
            tabs: [
              {
                id: "tabBackground",
                label: t("Background"),
                options: [
                  {
                    id: "",
                    type: "backgroundColor-dev",
                    states: [NORMAL, HOVER]
                  }
                ]
              },
              {
                id: "tabBorder",
                label: t("Border"),
                options: [
                  {
                    id: "border",
                    type: "border-dev",
                    devices: "desktop",
                    states: [NORMAL, HOVER]
                  }
                ]
              },
              {
                id: "tabBoxShadow",
                label: t("Shadow"),
                options: [
                  {
                    id: "boxShadow",
                    type: "boxShadow-dev",
                    devices: "desktop",
                    states: [NORMAL, HOVER]
                  }
                ]
              }
            ]
          }
        ]
      },
      {
        id: "toolbarSettings",
        type: "popover-dev",
        config: {
          icon: "nc-cog"
        },
        position: 110,
        options: [
          {
            id: "width",
            label: t("Width"),
            type: "slider-dev",
            config: {
              min: 1,
              max: dvv("widthSuffix") === "px" ? 1000 : 100,
              units: [
                { value: "px", title: "px" },
                { value: "%", title: "%" }
              ]
            }
          },
          {
            id: "grid",
            type: "grid",
            separator: true,
            columns: [
              {
                id: "grid-settings",
                width: 50,
                options: [
                  {
                    id: "styles",
                    type: "sidebarTabsButton-dev",
                    config: {
                      tabId: "styles",
                      text: t("Styling"),
                      icon: "nc-cog"
                    }
                  }
                ]
              },
              {
                id: "grid-effects",
                width: 50,
                options: [
                  {
                    id: "effects",
                    type: "sidebarTabsButton-dev",
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
