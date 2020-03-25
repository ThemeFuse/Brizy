import { t } from "visual/utils/i18n";
import { defaultValueKey } from "visual/utils/onChange";

export default (level, isMMenu) => {
  return {
    getItems: isMMenu ? getItemsMMenu(level) : getItemsSimple(level)
  };
};

const getItemsSimple = level => ({ v, device }) => {
  const dvk = key => defaultValueKey({ key, device });

  return [
    {
      id: "toolbarMenuItem",
      type: "popover",
      icon: "nc-star",
      title: t("Icon"),
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
                id: dvk("iconSize"),
                type: "slider",
                disabled: true
              },
              {
                id: "iconSpacing",
                type: "slider",
                disabled: true
              }
            ]
          : [])
      ]
    },
    {
      id: "subMenuToolbarMenuItem",
      type: "popover",
      icon: "nc-star",
      title: t("Icon"),
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
                type: "slider",
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
            type: "popover",
            disabled: true,
            options: []
          },
          {
            id: "subMenuToolbarColor",
            type: "popover",
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
            type: "popover",
            disabled: true,
            options: []
          },
          {
            id: "toolbarColor",
            type: "popover",
            disabled: true,
            options: []
          }
        ]
      : [])
  ];
};

// eslint-disable-next-line no-unused-vars
const getItemsMMenu = level => ({ v, device }) => {
  const dvk = key => defaultValueKey({ key, device });

  return [
    {
      id: "mMenuToolbarMenuItem",
      type: "popover",
      icon: "nc-star",
      title: t("Icon"),
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
                id: dvk("mMenuIconSize"),
                type: "slider",
                disabled: true
              },
              {
                id: dvk("mMenuIconSpacing"),
                type: "slider",
                disabled: true
              }
            ]
          : [])
      ]
    }
  ];
};
