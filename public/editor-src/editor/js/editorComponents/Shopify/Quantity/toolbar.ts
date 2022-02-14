import { ToolbarItemType } from "visual/editorComponents/ToolbarItemType";
import { t } from "visual/utils/i18n";

export const getItems = (): ToolbarItemType[] => {
  return [
    {
      id: "toolbarCart",
      type: "popover-dev",
      config: {
        size: "auto",
        title: t("Colors"),
        icon: "nc-woo-add-to-cart"
      },
      devices: "desktop",
      priority: 90,
      options: [
        {
          id: "itemId",
          label: "Select product",
          type: "select-dev",
          config: {
            search: true
          },
          choices: [
            {
              value: "841851",
              title: "841851"
            }
          ]
        }
      ]
    }
  ];
};
