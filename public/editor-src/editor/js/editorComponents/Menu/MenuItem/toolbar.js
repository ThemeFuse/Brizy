import { t } from "visual/utils/i18n";

export default (level, isMMenu) => {
  return {
    getItems: isMMenu ? getItemsMMenu(level) : getItemsSimple(level)
  };
};

const getItemsSimple = level => ({ v }) => {
  return [
    {
      id: "toolbarMenuSettings",
      type: "popover-dev",
      config: {
        icon: "nc-menu-3",
        title: t("Menu")
      },
      position: 10,
      disabled: level >= 1,
      options: [
        {
          id: "megaMenu",
          type: "switch-dev",
          devices: "desktop",
          label: t("Mega Menu")
        }
      ]
    },
    {
      id: "toolbarMenuItem",
      type: "popover-dev",
      config: {
        icon: "nc-star",
        title: t("Icon")
      },
      position: 20,
      disabled: level >= 1,
      options: [
        {
          id: "icon",
          type: "iconSetter",
          devices: "desktop",
          label: t("Icon"),
          canDelete: true,
          position: 10,
          value: {
            name: v.iconName,
            type: v.iconType
          },
          onChange: ({ name, type }) => ({
            iconName: name,
            iconType: type
          })
        },
        ...(v.iconName === ""
          ? [
              {
                id: "iconSize",
                type: "slider-dev",
                disabled: true
              },
              {
                id: "iconSpacing",
                type: "slider-dev",
                disabled: true
              }
            ]
          : [])
      ]
    },
    {
      id: "subMenuToolbarMenuItem",
      type: "popover-dev",
      config: {
        icon: "nc-star",
        title: t("Icon")
      },
      position: 20,
      disabled: level < 1,
      options: [
        {
          id: "iconImage",
          type: "iconSetter",
          devices: "desktop",
          label: t("Icon"),
          position: 10,
          canDelete: true,
          value: {
            name: v.iconName,
            type: v.iconType
          },
          onChange: ({ name, type }) => ({
            iconName: name,
            iconType: type
          })
        },
        ...(v.iconName === ""
          ? [
              {
                id: "subMenuIconSize",
                type: "slider-dev",
                disabled: true
              },
              {
                id: "subMenuIconSpacing",
                type: "slider",
                disabled: true
              }
            ]
          : [])
      ]
    },
    ...(level < 1
      ? [
          {
            id: "subMenuToolbarTypography",
            type: "popover-dev",
            disabled: true,
            options: []
          },
          {
            id: "subMenuToolbarColor",
            type: "popover-dev",
            disabled: true,
            options: []
          }
        ]
      : []),
    ...(level >= 1
      ? [
          {
            id: "advancedSettings",
            type: "advancedSettings",
            devices: "desktop"
          },
          {
            id: "toolbarTypography",
            type: "popover-dev",
            disabled: true,
            options: []
          },
          {
            id: "toolbarColor",
            type: "popover-dev",
            disabled: true,
            options: []
          }
        ]
      : [])
  ];
};

// eslint-disable-next-line no-unused-vars
const getItemsMMenu = level => ({ v, device }) => {
  return [
    {
      id: "mMenuToolbarMenuItem",
      type: "popover-dev",
      config: {
        icon: "nc-star",
        title: t("Icon")
      },
      position: 20,
      options: [
        {
          id: "icon",
          type: "iconSetter",
          devices: "desktop",
          label: t("Icon"),
          canDelete: true,
          position: 10,
          value: {
            name: v.iconName,
            type: v.iconType
          },
          onChange: ({ name, type }) => ({
            iconName: name,
            iconType: type
          })
        },
        ...(v.iconName === ""
          ? [
              {
                id: "mMenuIconSize",
                type: "slider-dev",
                disabled: true
              },
              {
                id: "mMenuIconSpacing",
                type: "slider-dev",
                disabled: true
              }
            ]
          : [])
      ]
    }
  ];
};
