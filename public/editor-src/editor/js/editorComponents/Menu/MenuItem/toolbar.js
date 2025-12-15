import { t } from "visual/utils/i18n";
import { defaultValueValue } from "visual/utils/onChange";

export default (level, isMMenu) => {
  return {
    getItems: isMMenu ? getItemsMMenu(level) : getItemsSimple(level)
  };
};

const getItemsSimple =
  (level) =>
  ({ v, device }) => {
    const dvv = (key) => defaultValueValue({ v, key, device });

    const iconName = dvv("iconName");
    const { editorUrl } = v;

    return [
      {
        id: "toolbarMenuSettings",
        type: "popover",
        config: {
          icon: "nc-menu-3",
          title: t("Menu")
        },
        position: 10,
        disabled: level >= 1,
        options: [
          {
            id: "megaMenu",
            type: "switch",
            devices: "desktop",
            label: t("Mega Menu")
          }
        ]
      },
      {
        id: "toolbarMenuItem",
        type: "popover",
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
            config: { canDelete: true },
            position: 10
          },
          ...(iconName === ""
            ? [
                {
                  id: "iconPosition",
                  type: "radioGroup",
                  disabled: true
                },
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
              ]
            : [])
        ]
      },
      {
        id: "subMenuToolbarMenuItem",
        type: "popover",
        config: {
          icon: "nc-star",
          title: t("Icon")
        },
        position: 20,
        disabled: level < 1,
        options: [
          {
            id: "icon",
            type: "iconSetter",
            devices: "desktop",
            label: t("Icon"),
            position: 10,
            config: { canDelete: true }
          },
          ...(iconName === ""
            ? [
                {
                  id: "subMenuIconPosition",
                  type: "radioGroup",
                  disabled: true
                },
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
        : []),
      {
        id: "editorUrlToolbar",
        type: "button",
        disabled: !editorUrl,
        config: {
          icon: "t2-edit-menu-item",
          reverseTheme: true,
          title: t("Edit page")
        },
        onClick: () => {
          window.parent.location.assign(editorUrl);
        }
      }
    ];
  };

const getItemsMMenu =
  () =>
  ({ v, device }) => {
    const dvv = (key) => defaultValueValue({ v, key, device });

    const iconName = dvv("iconName");

    const { editorUrl } = v;

    return [
      {
        id: "mMenuToolbarMenuItem",
        type: "popover",
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
            config: { canDelete: true }
          },
          ...(iconName === ""
            ? [
                {
                  id: "mMenuIconPosition",
                  type: "radioGroup",
                  disabled: true
                },
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
              ]
            : [])
        ]
      },
      {
        id: "mMenuEditorUrlToolbar",
        type: "button",
        disabled: !editorUrl,
        config: {
          icon: "t2-edit-menu-item",
          reverseTheme: true,
          title: t("Edit page")
        },
        onClick: () => {
          window.parent.location.assign(editorUrl);
        }
      }
    ];
  };
