import { t } from "visual/utils/i18n";
import { ToolbarItemType } from "../ToolbarItemType";

export const title = t("Filter");

export function getItems(): ToolbarItemType[] {
  return [
    {
      id: "sidebarTabs",
      type: "sidebarTabs-dev",
      tabs: [
        {
          id: "styles",
          title: t("Styling"),
          label: t("Styling"),
          options: [
            {
              id: "settingsTabs",
              type: "tabs-dev",
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
                      id: "filterBorder",
                      type: "corners-dev",
                      label: t("Corner")
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
