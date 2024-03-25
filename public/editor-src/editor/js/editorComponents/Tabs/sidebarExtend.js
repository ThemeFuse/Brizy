import { t } from "visual/utils/i18n";
import { tabEffects } from "visual/utils/options/Animation/utils";

export function getItems() {
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
              id: "padding",
              type: "padding",
              label: t("Padding"),
              position: 50
            },
            {
              id: "border",
              type: "corners",
              label: t("Corner"),
              devices: "desktop",
              position: 65
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
              type: "tabs",

              tabs: [
                {
                  id: "entrance",
                  label: t("Entrance"),
                  options: [
                    {
                      id: "animation",
                      type: "animation",
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
