import { ToolbarItemType } from "visual/editorComponents/ToolbarItemType";
import { t } from "visual/utils/i18n";

export function getItems(): ToolbarItemType[] {
  return [
    {
      id: "sidebarTabs",
      type: "sidebarTabs",
      tabs: [
        {
          id: "styles",
          title: t("Styling"),
          label: t("Styling"),
          options: [
            {
              id: "imgPadding",
              label: t("Padding"),
              type: "padding",
              config: {
                units: ["px"]
              }
            }
          ]
        }
      ]
    }
  ];
}
