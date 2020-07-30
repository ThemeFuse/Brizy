import { t } from "visual/utils/i18n";

export function getItems() {
  return [
    {
      id: "toolbarSettings",
      type: "popover-dev",
      config: {
        title: t("Settings")
      },
      position: 110,
      options: [
        {
          id: "height",
          label: t("Height"),
          type: "slider-dev",
          config: {
            min: 10,
            max: 200,
            units: [{ value: "px", title: "px" }]
          }
        }
      ]
    },
    {
      id: "horizontalAlign",
      type: "toggle-dev",
      disabled: true
    }
  ];
}
