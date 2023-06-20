import { t } from "visual/utils/i18n";
import { defaultValueValue } from "visual/utils/onChange";
import type { GetItems } from "../EditorComponent/types";
import type { Props, Value } from "./index";

export const getItems: GetItems<Value, Props> = ({ v, device, state }) => {
  const dvv = (key: string): unknown =>
    defaultValueValue({ v, key, device, state });

  const layout = dvv("layout");
  const thumbStyle = dvv("thumbStyle");

  const isHorizontalStyle = thumbStyle === "left" || thumbStyle === "right";

  return [
    {
      id: "horizontalAlign",
      type: "toggle-dev",
      disabled: true,
      choices: []
    },
    {
      id: "toolbarGallery",
      type: "popover-dev",
      config: {
        icon: "nc-gallery",
        title: t("Gallery")
      },
      position: 80,
      options: [
        {
          id: "galleryTabs",
          type: "tabs-dev",
          tabs: [
            {
              id: "tabGallery",
              label: t("Gallery"),
              options: [
                {
                  id: "items",
                  type: "gallery-for-gallery-dev",
                  label: t("Images"),
                  devices: "desktop",
                  config: {
                    canDeleteLast: false
                  }
                },
                {
                  id: "groupLayout",
                  type: "group-dev",
                  options: [
                    {
                      id: "layout",
                      type: "select-dev",
                      label: t("Layout"),
                      devices: "desktop",
                      choices: [
                        { title: "Grid", value: "grid" },
                        { title: "Justified", value: "justified" },
                        { title: "Masonry", value: "masonry" },
                        { title: "Big Image", value: "bigImage" }
                      ]
                    },
                    {
                      id: "gridAspectRatio",
                      type: "select-dev",
                      label: t("Aspect Ratio"),
                      devices: "desktop",
                      disabled: layout !== "grid",
                      choices: [
                        { title: "1:1", value: "1/1" },
                        { title: "3:2", value: "3/2" },
                        { title: "4:3", value: "4/3" },
                        { title: "9:16", value: "9/16" },
                        { title: "16:9", value: "16/9" },
                        { title: "21:9", value: "21/9" }
                      ]
                    },
                    {
                      id: "rowHeight",
                      type: "slider-dev",
                      label: t("Height"),
                      disabled: layout !== "justified",
                      config: {
                        min: 50,
                        max: 500,
                        units: [{ value: "px", title: "px" }]
                      }
                    }
                  ]
                },
                {
                  id: "enableTags",
                  label: t("Enable Tags"),
                  type: "switch-dev",
                  devices: "desktop",
                  disabled: layout === "bigImage"
                }
              ]
            },
            {
              id: "tabItems",
              label: t("Items"),
              options: [
                {
                  id: "gridColumn",
                  type: "slider-dev",
                  label: t("Columns"),
                  disabled:
                    layout === "justified" ||
                    (layout === "bigImage" && isHorizontalStyle),
                  config: {
                    min: 1,
                    max: 6
                  }
                },
                {
                  id: "spacing",
                  type: "slider-dev",
                  label: t("Spacing"),
                  disabled: layout === "bigImage",
                  config: {
                    min: 0,
                    max: 20,
                    units: [{ value: "px", title: "px" }]
                  }
                }
              ]
            }
          ]
        }
      ]
    },
    {
      id: "toolbarLink",
      type: "popover-dev",
      config: {
        icon: "nc-link",
        size: "medium",
        title: t("Link")
      },
      position: 90,
      options: [
        {
          id: "lightBox",
          label: t("Open in Lightbox"),
          type: "switch-dev",
          devices: "desktop"
        }
      ]
    }
  ];
};
