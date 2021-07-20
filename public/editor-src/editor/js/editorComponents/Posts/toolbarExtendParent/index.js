import { t } from "visual/utils/i18n";
import {
  toolbarElementPostsColumns,
  toolbarElementPostsRows
} from "visual/utils/toolbar";
import { tabFilter } from "./tabFilter";
import { tagsFilter } from "./tagsFilter";

const getItems = context => ({ v, device }) => {
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

const getTypeInfo = v => {
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

  return {
    id: "posts",
    label: title,
    options: [
      // haven't moved to options-dev because of custom onchange
      toolbarElementPostsColumns({
        v,
        device,
        state: "normal"
      }),
      // haven't moved to options-dev because of custom onchange
      toolbarElementPostsRows({
        v,
        device,
        devices: "desktop",
        state: "normal"
      }),
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

export default context => ({
  getItems: getItems(context)
});
