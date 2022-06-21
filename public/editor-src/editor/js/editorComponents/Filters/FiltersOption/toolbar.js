import { t } from "visual/utils/i18n";

export function getItems() {
  return [
    {
      id: "toolbarCurrentShortcodeItem",
      type: "popover-dev",
      config: {
        icon: "nc-filters",
        title: t("Filter")
      },
      devices: "desktop",
      position: 70,
      options: [
        {
          id: "itemsTabs",
          type: "tabs",
          tabs: [
            {
              id: "item",
              label: "Item",
              position: 90,
              options: [
                {
                  id: "value",
                  label: t("Value"),
                  type: "inputText-dev",
                  position: 20,
                  placeholder: t("Value")
                },
                {
                  id: "label",
                  label: t("Label"),
                  type: "inputText-dev",
                  position: 20,
                  placeholder: t("Label")
                }
              ]
            }
          ]
        }
      ]
    }
  ];
}
