import { GetItems } from "visual/editorComponents/EditorComponent/types";
import { t } from "visual/utils/i18n";
import { Value } from "./types";

export const getItems: GetItems<Value> = () => {
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
                      id: "throughPricePadding",
                      type: "padding-dev",
                      label: t("Padding")
                    },
                    {
                      id: "throughPriceMargin",
                      label: t("Margin"),
                      type: "margin-dev"
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
