import { t } from "visual/utils/i18n";
import { defaultValueKey } from "visual/utils/onChange";

export function getItems({ device }) {
  const dvk = key => defaultValueKey({ key, device });

  return [
    {
      id: dvk("toolbarWOOPages"),
      type: "popover",
      devices: "desktop",
      icon: "nc-woo-2",
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
            }
          ]
        }
      ]
    },
    {
      id: dvk("toolbarSettings"),
      type: "popover",
      roles: ["admin"],
      icon: "nc-cog",
      position: 110,
      options: [
        {
          id: "width",
          label: t("Width"),
          type: "slider-dev",
          config: {
            min: 1,
            max: 100,
            units: [{ value: "%", title: "%" }]
          }
        },
        {
          id: dvk("advancedSettings"),
          type: "advancedSettings",
          label: t("More Settings"),
          icon: "nc-cog"
        }
      ]
    }
  ];
}
