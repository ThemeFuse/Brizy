import { t } from "visual/utils/i18n";
import { defaultValueValue } from "visual/utils/onChange";

export function getItems({ v, device }) {
  const dvv = (key) => defaultValueValue({ v, key, device });

  const iconName = dvv("iconName");
  const iconType = dvv("iconType");

  return [
    {
      id: "toolbarCurrentShortcode",
      type: "popover-dev",
      config: {
        icon: "nc-switcher",
        title: t("Switcher")
      },
      position: 70,
      options: [
        {
          id: "currentShortcodeSwitcher",
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
                    name: iconName,
                    type: iconType
                  },
                  onChange: ({ name, type }) => {
                    return {
                      iconName: name,
                      iconType: type
                    };
                  }
                },
                ...(iconName && iconType
                  ? []
                  : [
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
                    ])
              ]
            }
          ]
        }
      ]
    }
  ];
}
