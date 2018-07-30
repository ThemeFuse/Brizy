import { t } from "visual/utils/i18n";

export default sidebars => {
  const sidebarsList = sidebars.map(sidebar => ({
    title: sidebar.title,
    value: sidebar.id
  }));

  return {
    getItemsForDesktop: getItemsForDesktop(sidebarsList),
    getItemsForMobile
  };
};

const getItemsForDesktop = sidebars => v => [
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
        onChange: ({ value: width }) => {
          return {
            width,
            mobileWidth: v.width === v.mobileWidth ? width : v.mobileWidth
          };
        }
      }
    ]
  }
];

const getItemsForMobile = v => [
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
          value: v.mobileWidth
        },
        onChange: ({ value: mobileWidth }) => {
          return {
            mobileWidth
          };
        }
      }
    ]
  }
];
