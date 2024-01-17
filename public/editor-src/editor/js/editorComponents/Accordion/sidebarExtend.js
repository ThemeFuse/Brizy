import { tabEffects } from "visual/component/Options/types/dev/Animation/utils.ts";
import { t } from "visual/utils/i18n";

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
              id: "titlePadding",
              label: t("Title Padding"),
              position: 40,
              type: "padding"
            },
            {
              id: "padding",
              label: t("Content Padding"),
              position: 50,
              type: "padding"
            },
            {
              id: "border",
              type: "corners",
              label: t("Corner"),
              position: 65
            },
            {
              id: "tagName",
              label: t("HTML Tag"),
              type: "select",
              choices: [
                { title: "Span", value: "span" },
                { title: "Div", value: "div" },
                { title: "P", value: "p" },
                { title: "H1", value: "h1" },
                { title: "H2", value: "h2" },
                { title: "H3", value: "h3" },
                { title: "H4", value: "h4" },
                { title: "H5", value: "h5" },
                { title: "H6", value: "h6" },
                { title: "PRE", value: "pre" }
              ]
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
