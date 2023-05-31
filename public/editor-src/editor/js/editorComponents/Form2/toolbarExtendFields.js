import { t } from "visual/utils/i18n";

export function getItems() {
  return [
    {
      id: "toolbarCurrentElement",
      type: "popover-dev",
      options: [
        {
          id: "currentShortcodeTabs",
          type: "tabs-dev",
          tabs: [
            {
              id: "field",
              options: [
                {
                  id: "padding",
                  type: "slider-dev",
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
                  type: "switch-dev",
                  position: 15,
                  devices: "desktop"
                },
                {
                  id: "placeholder",
                  label: t("Placeholder"),
                  type: "switch-dev",
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
