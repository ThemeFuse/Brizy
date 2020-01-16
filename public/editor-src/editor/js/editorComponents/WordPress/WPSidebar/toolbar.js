import { t } from "visual/utils/i18n";
import { tabletSyncOnChange, mobileSyncOnChange } from "visual/utils/onChange";
import { toolbarDisabledAdvancedSettings } from "visual/utils/toolbar";

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

const getItemsForDesktop = sidebars => v => {
  const device = "desktop";
  return [
    {
      id: "toolbarWPSidebar",
      type: "popover",
      icon: "nc-wp-shortcode",
      position: 90,
      options: [
        {
          id: "sidebar",
          label: t("Sidebar"),
          type: "select",
          choices: sidebars,
          value: v.sidebar
        }
      ]
    },
    toolbarDisabledAdvancedSettings({ device }),
    {
      id: "toolbarSettings",
      type: "popover",
      icon: "nc-cog",
      roles: ["admin"],
      position: 110,
      options: [
        {
          id: "width",
          label: t("Width"),
          type: "slider",
          slider: {
            min: 1,
            max: 100
          },
          input: {
            show: true
          },
          suffix: {
            show: true,
            choices: [
              {
                title: "%",
                value: "%"
              }
            ]
          },
          value: {
            value: v.width
          },
          onChange: ({ value: width }) => ({ width })
        },
        {
          id: "advancedSettings",
          type: "advancedSettings",
          label: t("More Settings"),
          icon: "nc-cog",
          options: [
            {
              id: "settingsTabs",
              type: "tabs",
              align: "start",
              tabs: [
                {
                  id: "settingsStyling",
                  label: t("Styling"),
                  tabIcon: "nc-styling",
                  options: []
                },
                {
                  id: "moreSettingsAdvanced",
                  label: t("Advanced"),
                  tabIcon: "nc-cog",
                  options: []
                }
              ]
            }
          ]
        }
      ]
    }
  ];
};

const getItemsForTablet = v => {
  const device = "tablet";

  return [
    toolbarDisabledAdvancedSettings({ device }),
    {
      id: "tabletToolbarSettings",
      type: "popover",
      icon: "nc-cog",
      roles: ["admin"],
      position: 110,
      options: [
        {
          id: "tabletWidth",
          label: t("Width"),
          type: "slider",
          slider: {
            min: 1,
            max: 100
          },
          input: {
            show: true
          },
          suffix: {
            show: true,
            choices: [
              {
                title: "%",
                value: "%"
              }
            ]
          },
          value: {
            value: tabletSyncOnChange(v, "width")
          },
          onChange: ({ value: tabletWidth }) => ({ tabletWidth })
        }
      ]
    }
  ];
};

const getItemsForMobile = v => {
  const device = "mobile";

  return [
    toolbarDisabledAdvancedSettings({ device }),
    {
      id: "mobileToolbarSettings",
      type: "popover",
      icon: "nc-cog",
      roles: ["admin"],
      position: 110,
      options: [
        {
          id: "mobileWidth",
          label: t("Width"),
          type: "slider",
          slider: {
            min: 1,
            max: 100
          },
          input: {
            show: true
          },
          suffix: {
            show: true,
            choices: [
              {
                title: "%",
                value: "%"
              }
            ]
          },
          value: {
            value: mobileSyncOnChange(v, "width")
          },
          onChange: ({ value: mobileWidth }) => ({ mobileWidth })
        }
      ]
    }
  ];
};
