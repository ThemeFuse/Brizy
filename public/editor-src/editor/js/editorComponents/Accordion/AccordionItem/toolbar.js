import { t } from "visual/utils/i18n";

export function getItems() {
  return [
    {
      id: "toolbarCurrentShortcode",
      type: "popover",
      config: {
        icon: "nc-toggle",
        title: t("Accordion")
      },
      position: 60,
      options: [
        {
          id: "media",
          type: "tabs",
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
                  type: "inputText",
                  label: t("Tags"),
                  helper: {
                    enabled: true,
                    content: t(
                      "Enter the tags, separated by a comma (art, sport, nature, etc)."
                    )
                  },
                  placeholder: t("art, nature, etc."),
                  devices: "desktop",
                  config: {
                    size: "medium"
                  }
                }
              ]
            }
          ]
        }
      ]
    }
  ];
}
