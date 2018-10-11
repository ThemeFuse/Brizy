import { t } from "visual/utils/i18n";
import { tabletSyncOnChange, mobileSyncOnChange } from "visual/utils/onChange";


export function getItemsForDesktop(v) {
  return [
    {
      id: "toolbarWOOPages",
      type: "popover",
      icon: "nc-woo-2",
      position: 10,
      options: [
        {
          id: "shortcode",
          label: t("Page"),
          type: "select",
          choices: [
            { title: t("Cart"), value: "woocommerce_cart" },
            { title: t("Checkout"), value: "woocommerce_checkout" },
            { title: t("My Account"), value: "woocommerce_my_account" },
            { title: t("Order Tracking"), value: "woocommerce_order_tracking" }
          ],
          value: v.shortcode
        }
      ]
    },
    {
      id: "toolbarSettings",
      type: "popover",
      roles: ["admin"],
      icon: "nc-cog",
      position: 110,
      options: [
        {
          id: "width",
          label: t("Width"),
          type: "slider",
          slider: {
            min: 1,
            max: 100
          },
          input: {
            show: true
          },
          suffix: {
            show: true,
            choices: [
              {
                title: "%",
                value: "%"
              }
            ]
          },
          value: {
            value: v.width
          },
          onChange: ({ value: width }) => {
            return {
              width
            };
          }
        }
      ]
    }
  ];
}

export function getItemsForMobile(v) {
  return [
    {
      id: "mobileToolbarSettings",
      type: "popover",
      roles: ["admin"],
      icon: "nc-cog",
      position: 110,
      options: [
        {
          id: "mobileWidth",
          label: t("Width"),
          type: "slider",
          slider: {
            min: 1,
            max: 100
          },
          input: {
            show: true
          },
          suffix: {
            show: true,
            choices: [
              {
                title: "%",
                value: "%"
              }
            ]
          },
          value: {
            value: mobileSyncOnChange(v, "width")
          },
          onChange: ({ value: mobileWidth }) => {
            return {
              mobileWidth
            };
          }
        }
      ]
    }
  ];
}
