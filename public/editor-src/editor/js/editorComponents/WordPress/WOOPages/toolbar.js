import { t } from "visual/utils/i18n";
import { defaultValueValue } from "visual/utils/onChange";

export default taxonomies => {
  return {
    getItems: getItems(taxonomies)
  };
};

const getItems = taxonomies => ({ v, device }) => {
  const dvv = key => defaultValueValue({ v, key, device });

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
            { title: t("Order Tracking"), value: "woocommerce_order_tracking" },
            { title: t("Product"), value: "product" },
            { title: t("Products"), value: "products" }
          ]
        },
        {
          id: "productID",
          label: t("Product ID"),
          type: "inputText-dev",
          devices: "desktop",
          disabled: v.shortcode !== "product",
          placeholder: t("Product ID or SKU")
        },
        {
          id: "columns",
          label: t("Columns"),
          type: "slider-dev",
          devices: "desktop",
          disabled: v.shortcode !== "products",
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
          disabled: v.shortcode !== "products",
          config: {
            size: "short"
          }
        },
        {
          id: "category",
          label: t("Categories"),
          type: "select-dev",
          devices: "desktop",
          disabled: v.shortcode !== "products",
          choices: [
            {
              title: t("All"),
              value: ""
            },
            ...taxonomies.map(item => ({
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
          disabled: v.shortcode !== "products",
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
          disabled: v.shortcode !== "products",
          choices: [
            { value: "ASC", icon: "nc-up" },
            { value: "DESC", icon: "nc-down" }
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
