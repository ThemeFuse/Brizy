import { t } from "visual/utils/i18n";
import { ToolbarItemType } from "../ToolbarItemType";

export const getItems = (): ToolbarItemType[] => {
  return [
    {
      id: "toolbarSettings",
      type: "popover",
      config: {
        icon: "nc-cog",
        title: t("Settings")
      },
      roles: ["admin"],
      position: 110,
      options: [
        {
          id: "metaIconsSpacing",
          label: t("Spacing"),
          type: "slider",
          config: {
            min: 0,
            max: 150,
            units: [{ value: "px", title: "px" }]
          }
        }
      ]
    }
  ];
};
