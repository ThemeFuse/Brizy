import { t } from "visual/utils/i18n";

export function getItems() {
  return [
    {
      id: "toolbarSettings",
      type: "popover-dev",
      config: { icon: "nc-cog", title: t("Settings") },
      roles: ["admin"],
      position: 110,
      options: [
        {
          id: "width",
          label: t("Width"),
          type: "slider-dev",
          config: {
            min: 1,
            max: 100,
            units: [{ value: "%", title: "%" }]
          }
        }
      ]
    }
  ];
}
