import { t } from "visual/utils/i18n";
import { defaultValueValue } from "visual/utils/onChange";
import { tabFilter } from "./tabFilter";
import { tagsFilter } from "./tagsFilter";

const getItems =
  (context) =>
  ({ v, device }) => {
    const { icon: popoverIcon, title: popoverTitle } = getTypeInfo(v);
    const tabCurrentElement_ = tabCurrentElement(v, device);
    const tabFilter_ = tabFilter(v, context);
    const tabNavigation_ = tabNavigation(v);

    return [
      {
        id: "horizontalAlign",
        type: "toggle-dev",
        disabled: true
      },
      {
        id: "popoverCurrentElement",
        type: "popover-dev",
        config: {
          icon: popoverIcon,
          title: popoverTitle
        },
        roles: ["admin"],
        position: 80,
        options: [
          {
            id: "tabsCurrentElement",
            type: "tabs-dev",
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

const tabCurrentElement = (v, device) => {
  const { title } = getTypeInfo(v);

  const dvv = (key) => defaultValueValue({ key, v, device });

  const max =
    device === "desktop" ? 6 : Math.min(dvv("gridColumn") * dvv("gridRow"), 6);

  return {
    id: "posts",
    label: title,
    options: [
      {
        id: "gridColumn",
        type: "slider-dev",
        label: t("Columns"),
        config: {
          min: 1,
          max,
          inputMin: 1,
          inputMax: max,
          step: 1
        }
      },
      {
        id: "gridRow",
        type: "slider-dev",
        label: t("Rows"),
        devices: "desktop",
        config: {
          min: 1,
          max: 15,
          step: 1,
          inputMin: 1,
          inputMax: 50
        }
      },
      {
        id: "padding",
        label: t("Spacing"),
        type: "slider-dev",
        config: {
          min: 0,
          max: 100,
          units: [{ value: "px", title: "px" }]
        }
      }
    ]
  };
};

function tabNavigation(v) {
  const accepted = ["posts", "products", "archives", "archives-product"];

  if (!accepted.includes(v.type)) {
    return undefined;
  }

  const filters = tagsFilter(v);

  return {
    id: "navigation",
    label: t("Navigation"),
    options: [
      ...filters,
      {
        id: "groupPagination",
        type: "group-dev",
        devices: "desktop",
        options: [
          {
            id: "pagination",
            label: t("Pagination"),
            type: "switch-dev"
          },
          {
            id: "paginationSpacing",
            label: t("Spacing"),
            type: "slider-dev",
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
