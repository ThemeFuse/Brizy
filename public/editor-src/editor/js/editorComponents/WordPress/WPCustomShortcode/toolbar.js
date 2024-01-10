import { t } from "visual/utils/i18n";

export function getItems() {
  return [
    {
      id: "toolbarWPCustomShortcode",
      type: "popover",
      config: {
        icon: "nc-wp-shortcode",
        size: "large"
      },
      devices: "desktop",
      position: 10,
      options: [
        {
          id: "shortcode",
          type: "codeMirror-dev",
          devices: "desktop",
          placeholder: t("Example [gallery id='123' size='medium']"),
          config: {
            language: "html"
          }
        }
      ]
    },
    {
      id: "toolbarSettings",
      type: "popover",
      roles: ["admin"],
      position: 110,
      options: [
        {
          id: "width",
          label: t("Width"),
          type: "slider",
          config: {
            min: 1,
            max: 100,
            units: [{ value: "%", title: "%" }]
          }
        },
        {
          id: "grid",
          type: "legacy-grid",
          separator: true,
          columns: [
            {
              id: "grid-settings",
              width: 50,
              options: [
                {
                  id: "styles",
                  type: "sidebarTabsButton",
                  config: {
                    tabId: "styles",
                    text: t("Styling"),
                    icon: "nc-cog"
                  }
                }
              ]
            },
            {
              id: "grid-effects",
              width: 50,
              options: [
                {
                  id: "effects",
                  type: "sidebarTabsButton",
                  config: {
                    tabId: "effects",
                    text: t("Effects"),
                    icon: "nc-flash"
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
