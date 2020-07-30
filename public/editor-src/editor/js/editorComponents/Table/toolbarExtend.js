import { t } from "visual/utils/i18n";

export const getItems = () => {
  return [
    {
      id: "toolbarSettings",
      type: "popover-dev",
      config: {
        icon: "nc-cog"
      },
      title: t("Settings"),
      position: 110,
      options: [
        {
          id: "asideWidth",
          label: t("Width"),
          type: "slider-dev",
          position: 100,
          config: {
            min: 0,
            max: 500,
            units: [{ value: "px", title: "px" }]
          }
        }
      ]
    }
  ];
};
