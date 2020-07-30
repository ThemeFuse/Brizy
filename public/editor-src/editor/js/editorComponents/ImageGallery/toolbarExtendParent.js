import { t } from "visual/utils/i18n";

export function getItems() {
  return [
    {
      id: "horizontalAlign",
      type: "toggle-dev",
      disabled: true
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
          id: "enableTags",
          label: t("Enable Tags"),
          type: "switch-dev",
          devices: "desktop"
        },
        {
          id: "gridColumn",
          type: "slider-dev",
          label: t("Columns"),
          config: {
            min: 1,
            max: 6
          }
        },
        {
          id: "spacing",
          type: "slider-dev",
          label: t("Spacing"),
          config: {
            min: 0,
            max: 20,
            units: [{ value: "px", title: "px" }]
          }
        },
        {
          id: "lightBox",
          label: t("Open in Lightbox"),
          type: "switch-dev",
          devices: "desktop"
        }
      ]
    }
  ];
}
