import { t } from "visual/utils/i18n";
import {
  toolbarElementPostsTaxonomy,
  toolbarElementPostsColumns,
  toolbarElementPostsRows
} from "visual/utils/toolbar";

export function getItems({ v, device }) {
  return [
    {
      id: "horizontalAlign",
      type: "toggle-dev",
      disabled: true
    },
    ...(v.type === "archives"
      ? getToolbarArchives(v, device)
      : getToolbarPosts(v, device))
  ];
}

function getIcon(type) {
  switch (type) {
    case "relatedProducts":
      return "nc-woo-related-products";
    case "upsell":
      return "nc-woo-upsell";
    case "products":
      return "nc-woo-products";
    case "categories":
      return "nc-woo-categories";
    default:
      return "nc-wp-posts";
  }
}

function getTitle(type) {
  switch (type) {
    case "relatedProducts":
      return t("Related Products");
    case "upsell":
      return t("Upsell");
    case "products":
      return t("Products");
    case "categories":
      return t("Categories");
    default:
      return t("Posts");
  }
}

function getLabel(type) {
  switch (type) {
    case "relatedProducts":
      return t("Related");
    case "upsell":
      return t("Upsell");
    case "products":
      return t("Products");
    case "categories":
      return t("Categories");
    default:
      return t("Posts");
  }
}

function getFilters(v, device) {
  const { type } = v;

  const filtersOptions = type => {
    switch (type) {
      case "posts":
      case "products":
        return [
          toolbarElementPostsTaxonomy({
            v,
            device,
            type,
            devices: "desktop",
            state: "normal"
          }),
          {
            id: "orderBy",
            type: "select-dev",
            label: t("Filter By"),
            devices: "desktop",
            choices:
              type === "posts"
                ? [
                    { title: t("ID"), value: "ID" },
                    { title: t("Title"), value: "title" },
                    { title: t("Date"), value: "date" },
                    { title: t("Random"), value: "rand" },
                    { title: t("Comment Count"), value: "comment_count" }
                  ]
                : [
                    { title: t("Random"), value: "name" },
                    { title: t("Title"), value: "title" },
                    { title: t("Date"), value: "date" },
                    { title: t("Rating"), value: "rating" },
                    { title: t("Popularity"), value: "popularity" },
                    { title: t("Menu Order"), value: "menu_order" },
                    { title: t("Random"), value: "rand" },
                    { title: t("ID"), value: "ID" }
                  ]
          },
          {
            id: "order",
            type: "radioGroup-dev",
            label: t("Order"),
            devices: "desktop",
            choices: [
              { value: "ASC", icon: "nc-up" },
              { value: "DESC", icon: "nc-down" }
            ]
          },
          {
            id: "filter",
            type: "switch-dev",
            label: t("Tags filter"),
            devices: "desktop"
          }
        ];
      case "categories":
        return [
          {
            id: "orderBy",
            type: "select-dev",
            label: t("Filter By"),
            devices: "desktop",
            choices: [
              { title: t("Name"), value: "name" },
              { title: t("Slug"), value: "slug" },
              { title: t("Description"), value: "description" },
              { title: t("Count"), value: "count" }
            ]
          },
          {
            id: "order",
            type: "radioGroup-dev",
            label: t("Order"),
            devices: "desktop",
            choices: [
              { value: "ASC", icon: "nc-up" },
              { value: "DESC", icon: "nc-down" }
            ]
          }
        ];

      default:
        return [];
    }
  };

  return (
    filtersOptions(type) !== [] && {
      id: "filter",
      label: t("Filter"),
      options: filtersOptions(type)
    }
  );
}

function getToolbarArchives(v, device) {
  return [
    {
      id: "toolbarPosts",
      type: "popover-dev",
      config: {
        icon: "nc-wp-shortcode",
        title: t("Archives")
      },
      roles: ["admin"],
      position: 80,
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
    }
  ];
}

function getToolbarPosts(v, device) {
  return [
    {
      id: "toolbarPosts",
      type: "popover-dev",
      config: {
        icon: getIcon(v.type),
        title: getTitle(v.type)
      },
      roles: ["admin"],
      position: 80,
      options: [
        {
          type: "tabs-dev",
          tabs: [
            {
              id: "posts",
              label: t(getLabel(v.type)),
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
            },
            getFilters(v, device),
            {
              id: "navigation",
              label: t("Navigation"),
              options: [
                {
                  id: "groupPagination",
                  type: "group-dev",
                  devices: "desktop",
                  disabled: v.type !== "posts" && v.type !== "products",
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
            }
          ]
        }
      ]
    }
  ];
}
