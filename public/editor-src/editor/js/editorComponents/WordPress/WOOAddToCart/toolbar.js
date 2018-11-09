import { t } from "visual/utils/i18n";
import { tabletSyncOnChange, mobileSyncOnChange } from "visual/utils/onChange";

export function getItemsForDesktop(v) {
  return [
    {
      id: "toolbarWOOAddToCart",
      type: "popover",
      icon: "nc-woo-2",
      position: 10,
      options: [
        {
          id: "WOOAddToCartTabs",
          type: "tabs",
          tabs: [
            {
              id: "queryTab",
              label: t("Query"),
              options: [
                {
                  id: "productID",
                  label: t("Product"),
                  type: "input",
                  placeholder: t("Product ID or SKU"),
                  value: {
                    value: v.productID
                  },
                  onChange: ({ value: productID }) => ({
                    productID
                  })
                }
              ]
            },
            {
              id: "layoutTab",
              label: t("Layout"),
              options: [
                {
                  id: "style",
                  label: t("Style"),
                  type: "input",
                  placeholder: t("Style Add to Cart"),
                  value: {
                    value: v.style
                  },
                  onChange: ({ value: style }) => ({
                    style
                  })
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
          onChange: ({ value: width }) => ({ width })
        }
      ]
    }
  ];
}

export function getItemsForTablet(v) {
  return [
    {
      id: "tabletToolbarSettings",
      type: "popover",
      roles: ["admin"],
      icon: "nc-cog",
      position: 110,
      options: [
        {
          id: "tabletWidth",
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
            value: tabletSyncOnChange(v, "width")
          },
          onChange: ({ value: tabletWidth }) => ({ tabletWidth })
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
          onChange: ({ value: mobileWidth }) => ({ mobileWidth })
        }
      ]
    }
  ];
}
