import { ToolbarItemType } from "visual/editorComponents/ToolbarItemType";
import { t } from "visual/utils/i18n";
import { capByPrefix } from "visual/utils/string";

export const getItems = ({ key }: { key: string }): ToolbarItemType[] => {
  const marginId = capByPrefix(key, "margin");
  const paddingId = capByPrefix(key, "padding");

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
                  position: 10,
                  options: [
                    {
                      id: paddingId,
                      type: "padding",
                      label: t("Padding"),
                      devices: "desktop",
                      position: 50
                    },
                    {
                      id: marginId,
                      label: t("Margin"),
                      type: "margin",
                      devices: "desktop",
                      position: 60
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
};
