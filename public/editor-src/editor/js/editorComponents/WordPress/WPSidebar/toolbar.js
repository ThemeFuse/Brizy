import { t } from "visual/utils/i18n";

export default (sidebars) => {
  const sidebarsList = sidebars.map((sidebar) => ({
    title: sidebar.title,
    value: sidebar.id
  }));

  return {
    getItemsForDesktop: getItemsForDesktop(sidebarsList),
    getItemsForTablet,
    getItemsForMobile
  };
};

const getItemsForDesktop = (sidebars) => () => {
  return [
    {
      id: "toolbarWPSidebar",
      type: "popover",
      config: { icon: "nc-wp-shortcode" },
      position: 90,
      options: [
        {
          id: "sidebar",
          label: t("Sidebar"),
          type: "select",
          devices: "desktop",
          choices: sidebars
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
  ];
};

const getItemsForTablet = () => {
  return [
    {
      id: "tabletToolbarSettings",
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
        }
      ]
    }
  ];
};

const getItemsForMobile = () => {
  return [
    {
      id: "mobileToolbarSettings",
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
        }
      ]
    }
  ];
};
