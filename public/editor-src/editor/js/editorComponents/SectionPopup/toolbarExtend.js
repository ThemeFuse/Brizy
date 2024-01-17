import { t } from "visual/utils/i18n";

export function getItems() {
  return [
    {
      id: "toolbarSettings",
      type: "popover",
      cofnig: {
        icon: "nc-cog",
        title: t("Settings")
      },
      position: 100,
      options: [
        {
          id: "containerSize",
          label: t("Width"),
          type: "slider",
          position: 100,
          config: {
            min: 35,
            max: 100,
            units: [{ value: "%", title: "%" }]
          }
        }
      ]
    }
  ];
}
