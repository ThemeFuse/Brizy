import { t } from "visual/utils/i18n";

export function getItems({ v }) {
  return [
    {
      id: "toolbarCurrentShortcode",
      type: "popover-dev",
      config: {
        icon: "nc-star"
      },
      title: t("Table"),
      position: 50,
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
