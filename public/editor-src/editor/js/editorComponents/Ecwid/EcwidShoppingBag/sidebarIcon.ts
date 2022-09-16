import { ToolbarItemType } from "visual/editorComponents/ToolbarItemType";
import { t } from "visual/utils/i18n";

export function getItems(): ToolbarItemType[] {
  return [
    {
      id: "sidebarTabsIcon",
      type: "sidebarTabs-dev",
      tabs: [
        {
          id: "stylesIcon",
          title: t("Styling"),
          label: t("Styling"),
          options: [
            {
              id: "iconBorder",
              type: "corners-dev",
              label: t("Corner"),
              devices: "desktop"
            }
          ]
        }
      ]
    },
    {
      id: "sidebarTabs",
      type: "sidebarTabs-dev",
      disabled: true,
      tabs: []
    }
  ];
}
