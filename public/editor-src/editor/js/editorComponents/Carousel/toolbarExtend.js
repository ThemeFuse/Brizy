import { t } from "visual/utils/i18n";
import { hideToolbar } from "visual/component/Toolbar/index";

export function getItems({ v, device }) {
  return [
    {
      id: "duplicate",
      type: "button",
      devices: "desktop",
      icon: "nc-duplicate",
      title: t("Duplicate"),
      roles: ["admin"],
      position: 200,
      onChange: () => {
        return {
          columns: ++v.columns
        };
      }
    },
    ...(v.columns > v.slidesToShow && device === "desktop"
      ? [
          {
            id: "remove",
            type: "button",
            devices: "desktop",
            title: t("Delete"),
            roles: ["admin"],
            icon: "nc-trash",
            position: 250,
            onChange: () => {
              hideToolbar();

              return {
                columns: --v.columns
              };
            }
          }
        ]
      : [])
  ];
}
