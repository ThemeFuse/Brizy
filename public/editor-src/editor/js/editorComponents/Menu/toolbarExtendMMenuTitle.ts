import { t } from "visual/utils/i18n";
import { ToolbarItemType } from "../ToolbarItemType";

export function getItems(): ToolbarItemType[] {
  return [
    {
      id: "toolbarMenu",
      type: "popover-dev",
      config: {
        icon: "nc-menu-3",
        title: t("Menu")
      },
      options: [
        {
          id: "stickyTitle",
          type: "switch-dev",
          label: t("Sticky")
        }
      ]
    }
  ];
}
