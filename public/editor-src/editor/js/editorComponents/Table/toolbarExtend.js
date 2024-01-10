import { t } from "visual/utils/i18n";

export const getItems = () => {
  return [
    {
      id: "toolbarSettings",
      type: "popover",
      config: {
        icon: "nc-cog"
      },
      title: t("Settings"),
      position: 110,
      options: [
        {
          id: "widthType",
          label: t("Width Type"),
          type: "select",
          position: 90,
          choices: [
            { title: t("Auto"), value: "off" },
            { title: t("Custom"), value: "custom" }
          ]
        },
        {
          id: "asideWidth",
          label: t("Width"),
          type: "slider",
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
