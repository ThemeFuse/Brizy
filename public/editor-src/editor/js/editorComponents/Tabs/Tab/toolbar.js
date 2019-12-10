import { t } from "visual/utils/i18n";
import { defaultValueKey } from "visual/utils/onChange";

export function getItems({ v, device, state }) {
  const dvk = key => defaultValueKey({ key, device, state });

  return [
    {
      id: dvk("toolbarCurrentShortcode"),
      type: "popover",
      icon: "nc-star",
      title: t("Icon"),
      position: 70,
      options: [
        {
          id: dvk("currentShortcodeTabs"),
          className: "",
          type: "tabs",
          tabs: [
            {
              id: dvk("currentShortcodeTab"),
              label: t("Icon"),
              options: [
                {
                  id: "iconImage",
                  label: t("Icon"),
                  type: "iconSetter",
                  canDelete: true,
                  value: {
                    name: v.iconName,
                    type: v.iconType
                  },
                  onChange: ({ name, type }) => {
                    console.log(name, type);

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
