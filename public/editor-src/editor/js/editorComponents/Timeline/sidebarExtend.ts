import { ToolbarItemType } from "visual/editorComponents/ToolbarItemType";
import { t } from "visual/utils/i18n";

export const title = () => t("Timeline Items");

export function getItems(): ToolbarItemType[] {
  return [
    {
      id: "sidebarTabs",
      type: "sidebarTabs",
      devices: "desktop",
      tabs: [
        {
          id: "styles",
          title: t("Styling"),
          label: t("Styling"),
          options: [
            {
              id: "padding",
              type: "padding",
              label: t("Padding"),
              position: 50
            }
          ]
        }
      ]
    }
  ];
}
