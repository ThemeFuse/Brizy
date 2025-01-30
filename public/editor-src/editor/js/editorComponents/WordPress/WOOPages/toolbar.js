import { getColorToolbar } from "visual/utils/color";
import { t } from "visual/utils/i18n";
import { defaultValueValue } from "visual/utils/onChange";
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

    const bgColor = getColorToolbar(
      dvv("bgColorPalette"),
      dvv("bgColorHex"),
      dvv("bgColorOpacity")
    );

    const shortcode = dvv("shortcode");
    const disShortcodeProd = shortcode !== "products";

    return [
      {
        id: "toolbarWOOPages",
        type: "popover",
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
            type: "select",
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
            type: "inputText",
            devices: "desktop",
            disabled: shortcode !== "product",
            placeholder: t("Product ID or SKU")
          },
          {
            id: "columns",
            label: t("Columns"),
            type: "slider",
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
            type: "inputText",
            devices: "desktop",
            disabled: disShortcodeProd,
            config: {
              size: "short"
            }
          },
          {
            id: "category",
            label: t("Categories"),
            type: "select",
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
            type: "select",
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
            type: "radioGroup",
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
        position: 90,
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
                    id: "",
                    type: "backgroundColor",
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
                    type: "border",
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
                    type: "boxShadow",
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
        type: "popover",
        config: {
          icon: "nc-cog"
        },
        position: 110,
        options: [
          {
            id: "width",
            label: t("Width"),
            type: "slider",
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
            config: {
              separator: true
            },
            columns: [
              {
                id: "grid-settings",
                width: 50,
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
                id: "grid-effects",
                width: 50,
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
