import { t } from "visual/utils/i18n";

export default (sidebars) => {
  const sidebarsList = sidebars.map((sidebar) => ({
    title: sidebar.title,
    value: sidebar.id
  }));

  return {
    getItems: () => [
      {
        id: "toolbarWPSidebar",
        type: "popover",
        devices: "desktop",
        config: { icon: "nc-wp-shortcode" },
        position: 90,
        options: [
          {
            id: "sidebar",
            label: t("Sidebar"),
            type: "select",
            devices: "desktop",
            choices: sidebarsList
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
              units: [{ title: "%", value: "%" }]
            }
          },
          {
            id: "grid",
            type: "grid",
            devices: "desktop",
            config: {
              separator: true
            },
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
    ]
  };
};
