import { t } from "visual/utils/i18n";

const getToolbar = (v, level) => {
  const disabledItems = [
    {
      id: "iconSize",
      type: "slider",
      disabled: true
    },
    {
      id: "iconSpacing",
      type: "slider",
      disabled: true
    }
  ];
  const subMenuDisabledItems = [
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
  ];

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
          id: "iconImage",
          label: t("Icon"),
          type: "iconSetter",
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
        ...(v.iconName === "" ? disabledItems : [])
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
          label: t("Icon"),
          type: "iconSetter",
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
        ...(v.iconName === "" ? subMenuDisabledItems : [])
      ]
    }
  ];
};

const getMMenuToolbar = v => {
  const mMenuDisabledItems = [
    {
      id: "mMenuIconSize",
      type: "slider",
      disabled: true
    },
    {
      id: "mMenuIconSpacing",
      type: "slider",
      disabled: true
    }
  ];

  return [
    {
      id: "mMenuToolbarMenuItem",
      type: "popover",
      icon: "nc-star",
      title: t("Icon"),
      position: 20,
      options: [
        {
          id: "iconImage",
          label: t("Icon"),
          type: "iconSetter",
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
        ...(v.iconName === "" ? mMenuDisabledItems : [])
      ]
    }
  ];
};

export function getItemsForDesktop(v, component) {
  const { level, mMenu } = component.props;

  return [
    ...(mMenu ? getMMenuToolbar(v) : getToolbar(v, level)),
    {
      id: "toolbarMenu",
      type: "popover",
      disabled: true
    }
  ];
}

export function getItemsForTablet(v) {
  const mMenuDisabledItems = [
    {
      id: "tabletToolbarMenuItem",
      type: "popover",
      disabled: true
    },
    {
      id: "tabletMMenuToolbarMenuItem",
      type: "popover",
      disabled: true
    }
  ];

  return [
    ...(v.iconName === "" ? mMenuDisabledItems : []),
    {
      id: "tabletToolbarMenu",
      type: "popover",
      disabled: true
    }
  ];
}

export function getItemsForMobile(v) {
  const mMenuDisabledItems = [
    {
      id: "mobileToolbarMenuItem",
      type: "popover",
      disabled: true
    },
    {
      id: "mobileMMenuToolbarMenuItem",
      type: "popover",
      disabled: true
    }
  ];

  return [
    ...(v.iconName === "" ? mMenuDisabledItems : []),
    {
      id: "mobileToolbarMenu",
      type: "popover",
      disabled: true
    }
  ];
}
