import { t } from "visual/utils/i18n";
import { defaultValueValue } from "visual/utils/onChange";

export function getItems({ v, device }) {
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
            { title: t("Product"), value: "product" }
          ]
        },
        {
          id: "productID",
          label: t("Product ID"),
          type: "inputText-dev",
          devices: "desktop",
          disabled: v.shortcode !== "product",
          placeholder: t("Product ID or SKU")
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
          id: "advancedSettings",
          type: "advancedSettings",
          label: t("More Settings"),
          icon: "nc-cog"
        }
      ]
    }
  ];
}
