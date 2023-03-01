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
                  id: "icon",
                  label: t("Icon"),
                  type: "iconSetter-dev",
                  devices: "desktop",
                  config: { canDelete: true }
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
