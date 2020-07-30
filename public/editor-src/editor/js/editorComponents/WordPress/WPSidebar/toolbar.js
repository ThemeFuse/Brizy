import { t } from "visual/utils/i18n";

export default sidebars => {
  const sidebarsList = sidebars.map(sidebar => ({
    title: sidebar.title,
    value: sidebar.id
  }));

  return {
    getItemsForDesktop: getItemsForDesktop(sidebarsList),
    getItemsForTablet,
    getItemsForMobile
  };
};

const getItemsForDesktop = sidebars => () => {
  return [
    {
      id: "toolbarWPSidebar",
      type: "popover-dev",
      config: { icon: "nc-wp-shortcode" },
      position: 90,
      options: [
        {
          id: "sidebar",
          label: t("Sidebar"),
          type: "select-dev",
          devices: "desktop",
          choices: sidebars
        }
      ]
    },
    {
      id: "toolbarSettings",
      type: "popover-dev",
      roles: ["admin"],
      position: 110,
      options: [
        {
          id: "width",
          label: t("Width"),
          type: "slider-dev",
          config: {
            min: 1,
            max: 100,
            units: [{ title: "%", value: "%" }]
          }
        },
        {
          id: "advancedSettings",
          type: "advancedSettings",
          label: t("More Settings"),
          icon: "nc-cog"
        }
      ]
    }
  ];
};

const getItemsForTablet = () => {
  return [
    {
      id: "tabletToolbarSettings",
      type: "popover-dev",
      roles: ["admin"],
      position: 110,
      options: [
        {
          id: "width",
          label: t("Width"),
          type: "slider-dev",
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
      type: "popover-dev",
      roles: ["admin"],
      position: 110,
      options: [
        {
          id: "width",
          label: t("Width"),
          type: "slider-dev",
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
