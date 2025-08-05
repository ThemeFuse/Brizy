import { t } from "visual/utils/i18n";
import { ToolbarItemType } from "../ToolbarItemType";

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
              id: "settingsTabs",
              type: "tabs",
              config: {
                align: "start"
              },
              devices: "desktop",
              tabs: [
                {
                  id: "settingsStyling",
                  label: t("Basic"),
                  options: [
                    {
                      id: "titleMargin",
                      type: "margin",
                      label: t("Margin")
                    }
                  ]
                }
              ]
            }
          ]
        }
      ]
    }
  ];
}
