import { t } from "visual/utils/i18n";
import { tabEffects } from "visual/component/Options/types/dev/Animation/utils";

export function getItems() {
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
              id: "padding",
              type: "padding-dev",
              label: t("Padding"),
              position: 50
            }
          ]
        },
        {
          id: "effects",
          title: t("Effects"),
          label: t("Effects"),
          options: [
            {
              id: "tabs",
              type: "tabs-dev",

              tabs: [
                {
                  id: "entrance",
                  label: t("Entrance"),
                  options: [
                    {
                      id: "animation",
                      type: "animation-dev",
                      config: {
                        types: tabEffects
                      }
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
