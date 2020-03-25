import { t } from "visual/utils/i18n";

export function getItems({ v }) {
  return [
    {
      id: "toolbarCurrentShortcode",
      type: "popover",
      icon: "nc-tabs",
      title: t("Tabs"),
      position: 70,
      options: [
        {
          id: "currentShortcodeTabs",
          className: "",
          type: "tabs",
          tabs: [
            {
              id: "currentShortcodeIcon",
              label: t("Icon"),
              options: [
                {
                  id: "iconImage",
                  label: t("Icon"),
                  type: "iconSetter",
                  devices: "desktop",
                  canDelete: true,
                  value: {
                    name: v.iconName,
                    type: v.iconType
                  },
                  onChange: ({ name, type }) => {
                    return {
                      iconName: name,
                      iconType: type
                    };
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
