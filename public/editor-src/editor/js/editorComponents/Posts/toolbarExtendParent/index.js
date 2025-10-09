import { t } from "visual/utils/i18n";
import { tabFilter } from "./tabFilter";
import { tagsFilter } from "./tagsFilter";
import { disableNavigation, maxColumn } from "./utils";

const getItems =
  (context) =>
  ({ v, device, componentConfig, component }) => {
    const config = component.getGlobalConfig();

    const { icon: popoverIcon, title: _popoverTitle } = getTypeInfo(v);

    const tabCurrentElement_ = tabCurrentElement(v, device);
    const tabFilter_ = tabFilter(v, context, componentConfig, config);
    const tabNavigation_ = tabNavigation(v, config);

    const popoverTitle = getTitle(v.component) ?? _popoverTitle;

    return [
      {
        id: "horizontalAlign",
        type: "toggle",
        disabled: true
      },
      {
        id: "popoverCurrentElement",
        type: "popover",
        config: {
          icon: popoverIcon,
          title: popoverTitle
        },
        roles: ["admin"],
        position: 80,
        options: [
          {
            id: "tabsCurrentElement",
            type: "tabs",
            tabs: [
              ...(tabCurrentElement_ ? [tabCurrentElement_] : []),
              ...(tabFilter_ ? [tabFilter_] : []),
              ...(tabNavigation_ ? [tabNavigation_] : [])
            ]
          }
        ]
      }
    ];
  };

const getTypeInfo = (v) => {
  switch (v.type) {
    case "posts":
      return {
        title: t("Posts"),
        icon: "nc-wp-posts"
      };
    case "archives":
      return {
        title: t("Archive"),
        icon: "nc-archives"
      };
    case "products":
      return {
        title: t("Products"),
        icon: "nc-woo-products"
      };
    case "archives-product":
      return {
        title: t("Archive"),
        icon: "nc-archives"
      };
    case "upsell":
      return {
        title: t("Upsell"),
        icon: "nc-woo-upsell"
      };
    default:
      throw new Error(`unknown Posts type: ${v.type}`);
  }
};

/*
component: "shopify-products" | "shopify-collections" | "shopify-posts" | "ecwid-product" | "ecwid-category"

returnType: string | undefined;
*/
export const getTitle = (component) => {
  switch (component) {
    case "shopify-product":
    case "ecwid-product":
      return t("Products");
    case "shopify-collection":
      return t("Collections");
    case "shopify-article":
      return t("Posts");
    case "ecwid-category":
      return t("Categories");
  }
};

const tabCurrentElement = (v, device) => {
  const { title: _title } = getTypeInfo(v);

  const title = getTitle(v.component) || _title;

  return {
    id: "posts",
    label: title,
    options: [
      {
        id: "gridColumn",
        type: "slider",
        label: t("Columns"),
        config: {
          min: 1,
          max: maxColumn(device),
          inputMin: 1,
          inputMax: maxColumn(device),
          step: 1
        }
      },
      {
        id: "gridRow",
        type: "slider",
        label: t("Rows"),
        devices: "desktop",
        config: {
          min: 1,
          max: 15,
          step: 1,
          inputMin: 1,
          inputMax: 100
        }
      },
      {
        id: "padding",
        label: t("Spacing"),
        type: "slider",
        config: {
          min: 0,
          max: 100,
          units: [{ value: "px", title: "px" }]
        }
      }
    ]
  };
};

function tabNavigation(v, config) {
  const accepted = ["posts", "products", "archives", "archives-product"];

  if (!accepted.includes(v.type)) {
    return undefined;
  }

  const filters = tagsFilter(v, config);

  return {
    id: "navigation",
    label: t("Navigation"),
    options: [
      ...filters,
      {
        id: "groupPagination",
        type: "group",
        devices: "desktop",
        options: [
          {
            id: "pagination",
            label: t("Pagination"),
            type: "switch",
            disabled: disableNavigation(v)
          },
          {
            id: "paginationSpacing",
            label: t("Spacing"),
            type: "slider",
            disabled: v.pagination !== "on",
            config: {
              min: 0,
              max: 100,
              units: [{ title: "px", value: "px" }]
            }
          }
        ]
      }
    ]
  };
}

export default (context) => ({
  getItems: getItems(context)
});
