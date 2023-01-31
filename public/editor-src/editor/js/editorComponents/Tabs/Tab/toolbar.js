import { t } from "visual/utils/i18n";
import { defaultValueValue } from "visual/utils/onChange";

export function getItems({ v, device }) {
  const dvv = (key) => defaultValueValue({ v, key, device });

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
                  id: "icon",
                  label: t("Icon"),
                  type: "iconSetter-dev",
                  devices: "desktop",
                  config: { canDelete: true }
                },
                ...(dvv("iconName") === ""
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
