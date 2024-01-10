import { t } from "visual/utils/i18n";

export function getItems() {
  return [
    {
      id: "toolbarCurrentElement",
      type: "popover",
      options: [
        {
          id: "currentShortcodeTabs",
          type: "tabs",
          tabs: [
            {
              id: "field",
              options: [
                {
                  id: "padding",
                  type: "slider",
                  label: t("Spacing"),
                  config: {
                    min: 0,
                    max: 100,
                    units: [{ title: "px", value: "px" }]
                  }
                }
              ]
            },
            {
              id: "advanced",
              options: [
                {
                  id: "label",
                  label: t("Label"),
                  type: "switch",
                  position: 15,
                  devices: "desktop"
                },
                {
                  id: "placeholder",
                  label: t("Placeholder"),
                  type: "switch",
                  position: 16,
                  devices: "desktop"
                }
              ]
            }
          ]
        }
      ]
    }
  ];
}
