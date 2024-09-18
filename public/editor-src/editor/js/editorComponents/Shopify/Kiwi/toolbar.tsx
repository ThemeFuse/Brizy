import { ToolbarItemType } from "visual/editorComponents/ToolbarItemType";
import { t } from "visual/utils/i18n";

export const getItems = (): ToolbarItemType[] => {
  return [
    {
      id: "toolbarKiwiChart",
      type: "popover",
      position: 10,
      devices: "desktop",
      config: {
        icon: "nc-shopify-logo",
        title: t("Information")
      },
      options: [
        {
          id: "displayMode",
          label: t("Display Mode"),
          type: "select",
          choices: [
            { title: "Link Modal", value: "1" },
            { title: "Button Modal", value: "2" },
            { title: "Inline", value: "0" }
          ]
        }
      ]
    },
    {
      id: "advancedSettings",
      type: "advancedSettings",
      devices: "desktop",
      position: 110,
      title: t("Settings")
    }
  ];
};
