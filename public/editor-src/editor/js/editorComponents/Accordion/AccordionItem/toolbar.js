import { t } from "visual/utils/i18n";

export function getItems() {
  return [
    {
      id: "toolbarCurrentShortcode",
      type: "popover-dev",
      config: {
        icon: "nc-toggle",
        title: t("Accordion")
      },
      position: 60,
      options: [
        {
          id: "media",
          type: "tabs-dev",
          tabs: [
            {
              id: "accordion",
              label: t("Accordion"),
              position: 60,
              options: []
            },
            {
              id: "tags",
              label: t("Tags"),
              position: 80,
              options: [
                {
                  id: "tags",
                  type: "inputText-dev",
                  label: t("Tags"),
                  helper: {
                    enabled: true,
                    content:
                      "Enter the tags, separated by a comma (art, sport, nature, etc).",
                    position: "top-left"
                  },
                  placeholder: "art, nature, etc.",
                  devices: "desktop"
                }
              ]
            }
          ]
        }
      ]
    }
  ];
}
