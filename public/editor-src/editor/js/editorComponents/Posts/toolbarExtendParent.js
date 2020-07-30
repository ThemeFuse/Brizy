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
      devices: "desktop",
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
        icon: "nc-wp-shortcode",
        title: t("Posts")
      },
      roles: ["admin"],
      position: 80,
      options: [
        {
          type: "tabs-dev",
          tabs: [
            {
              id: "posts",
              label: t("Posts"),
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
            {
              id: "filter",
              label: t("Filter"),
              options: [
                // haven't moved to options-dev because of custom onchange
                toolbarElementPostsTaxonomy({
                  v,
                  device,
                  devices: "desktop",
                  state: "normal"
                }),
                {
                  id: "orderBy",
                  type: "select-dev",
                  label: t("Filter By"),
                  devices: "desktop",
                  choices: [
                    { title: t("ID"), value: "ID" },
                    { title: t("Title"), value: "title" },
                    { title: t("Date"), value: "date" },
                    { title: t("Random"), value: "rand" },
                    { title: t("Comment Count"), value: "comment_count" }
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
              ]
            },
            {
              id: "navigation",
              label: t("Navigation"),
              options: [
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
            }
          ]
        }
      ]
    }
  ];
}
