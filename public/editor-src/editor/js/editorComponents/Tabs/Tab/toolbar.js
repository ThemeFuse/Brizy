import { t } from "visual/utils/i18n";

export function getItems({ v }) {
  return [
    {
      id: "toolbarCurrentShortcode",
      type: "popover-dev",
      config: {
        icon: "nc-tabs",
        title: t("Tabs")
      },
      position: 70,
      options: [
        {
          id: "currentShortcodeTabs",
          className: "",
          type: "tabs-dev",
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
                },
                ...(v.iconName === ""
                  ? [
                      {
                        id: "iconPosition",
                        type: "radioGroup-dev",
                        disabled: true
                      },
                      {
                        id: "groupIconSizesPicker",
                        type: "group-dev",
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
            }
          ]
        }
      ]
    }
  ];
}
