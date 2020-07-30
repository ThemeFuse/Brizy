import { t } from "visual/utils/i18n";
import { defaultValueKey } from "visual/utils/onChange";

export function getItems({ v, device }) {
  const dvk = key => defaultValueKey({ key, device, state: "normal" });

  return [
    {
      id: dvk("toolbarCurrentShortcode"),
      type: "popover-dev",
      config: {
        icon: "nc-star"
      },
      title: t("Table"),
      position: 70,
      options: [
        {
          id: "currentShortcodeTabs",
          className: "",
          type: "tabs-dev",
          tabs: [
            {
              id: "currentShortcodeTab",
              label: t("Icon"),
              position: 60,
              options: [
                {
                  id: "iconImage",
                  label: t("Icon"),
                  type: "iconSetter",
                  devices: "desktop",
                  canDelete: true,
                  value: {
                    name: v.name,
                    type: v.type
                  },
                  onChange: ({ name, type }) => ({
                    name: name,
                    type: type
                  })
                }
              ]
            }
          ]
        }
      ]
    }
  ];
}
