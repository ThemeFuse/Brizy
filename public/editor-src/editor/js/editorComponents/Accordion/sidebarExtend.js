import { t } from "visual/utils/i18n";
import { tabEffects } from "visual/component/Options/types/dev/Animation/utils.ts";

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
              id: "titlePadding",
              label: t("Title Padding"),
              position: 40,
              type: "padding-dev"
            },
            {
              id: "padding",
              label: t("Content Padding"),
              position: 50,
              type: "padding-dev"
            },
            {
              id: "border",
              type: "corners-dev",
              label: t("Corner"),
              position: 65
            },
            {
              id: "tagName",
              label: t("HTML Tag"),
              type: "select-dev",
              choices: [
                { title: t("Span"), value: "span" },
                { title: t("Div"), value: "div" },
                { title: t("P"), value: "p" },
                { title: t("H1"), value: "h1" },
                { title: t("H2"), value: "h2" },
                { title: t("H3"), value: "h3" },
                { title: t("H4"), value: "h4" },
                { title: t("H5"), value: "h5" },
                { title: t("H6"), value: "h6" },
                { title: t("PRE"), value: "pre" }
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
