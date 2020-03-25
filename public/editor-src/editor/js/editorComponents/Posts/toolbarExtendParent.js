import { getOptionColorHexByPalette } from "visual/utils/options";
import { hexToRgba } from "visual/utils/color";
import { t } from "visual/utils/i18n";
import { defaultValueValue, defaultValueKey } from "visual/utils/onChange";
import {
  toolbarElementPostsTaxonomy,
  toolbarElementPostsOrder,
  toolbarElementPostsPagination
} from "visual/utils/toolbar";

export function getItems({ v, device }) {
  const dvk = key => defaultValueKey({ key, device, state: "normal" });
  const dvv = key => defaultValueValue({ v, key, device, state: "normal" });

  const { hex: paginationColorHex } = getOptionColorHexByPalette(
    dvv("paginationColorHex"),
    dvv("paginationColorPalette")
  );

  return [
    {
      id: "horizontalAlign",
      type: "toggle-dev",
      disabled: true
    },
    ...(dvv("type") === "archives"
      ? getToolbarArchives(v, device)
      : getToolbarPosts(v, device)),
    {
      id: dvk("toolbarColor"),
      type: "popover",
      devices: "desktop",
      size: "auto",
      title: t("Colors"),
      roles: ["admin"],
      disabled: dvv("pagination") === "off",
      position: 80,
      icon: {
        style: {
          backgroundColor: hexToRgba(
            paginationColorHex,
            dvv("paginationColorOpacity")
          )
        }
      },
      options: [
        {
          type: "tabs",
          hideHandlesWhenOne: false,
          tabs: [
            {
              label: t("Pagination"),
              options: [
                {
                  id: "paginationColor",
                  type: "colorPicker-dev"
                }
              ]
            }
          ]
        }
      ]
    }
  ];
}

function getToolbarArchives(v, device) {
  const dvk = key => defaultValueKey({ key, device, state: "normal" });

  return [
    {
      id: dvk("toolbarPosts"),
      type: "popover",
      icon: "nc-wp-shortcode",
      title: t("Archives"),
      roles: ["admin"],
      devices: "desktop",
      position: 80,
      options: [
        {
          id: "gridColumn",
          label: t("Columns"),
          type: "slider-dev",
          config: {
            min: 1,
            max: 6
          }
        },
        {
          id: "gridRow",
          label: t("Rows"),
          type: "slider-dev",
          devices: "desktop",
          config: {
            min: 1,
            max: 10
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
    }
  ];
}

function getToolbarPosts(v, device) {
  const dvk = key => defaultValueKey({ key, device, state: "normal" });

  return [
    {
      id: dvk("toolbarPosts"),
      type: "popover",
      icon: "nc-wp-shortcode",
      title: t("Posts"),
      roles: ["admin"],
      position: 80,
      options: [
        {
          type: "tabs",
          devices: "desktop",
          tabs: [
            {
              label: t("Posts"),
              options: [
                {
                  id: "gridColumn",
                  label: t("Columns"),
                  type: "slider-dev",
                  config: {
                    min: 1,
                    max: 6
                  }
                },
                {
                  id: "gridRow",
                  label: t("Rows"),
                  type: "slider-dev",
                  config: {
                    min: 1,
                    max: 10
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
            },
            {
              label: t("Filter"),
              options: [
                toolbarElementPostsTaxonomy({
                  v,
                  device,
                  state: "normal"
                }),
                {
                  id: "orderBy",
                  label: t("Filter By"),
                  type: "select-dev",
                  choices: [
                    { title: t("ID"), value: "ID" },
                    { title: t("Title"), value: "title" },
                    { title: t("Date"), value: "date" },
                    { title: t("Random"), value: "rand" },
                    { title: t("Comment Count"), value: "comment_count" }
                  ]
                },
                toolbarElementPostsOrder({
                  v,
                  device,
                  state: "normal"
                })
              ]
            },
            {
              label: t("Navigation"),
              options: [
                toolbarElementPostsPagination({
                  v,
                  device,
                  state: "normal"
                })
              ]
            }
          ]
        },
        {
          id: "gridColumn",
          label: t("Columns"),
          type: "slider-dev",
          disabled: device !== "tablet",
          config: {
            min: 1,
            max: 6
          }
        },
        {
          id: "padding",
          label: t("Spacing"),
          type: "slider-dev",
          devices: "responsive",
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
