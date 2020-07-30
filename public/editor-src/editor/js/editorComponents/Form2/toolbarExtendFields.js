import { t } from "visual/utils/i18n";
import { toolbarElementForm2SpacingPx } from "visual/utils/toolbar";

export function getItems({ v, device }) {
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
                toolbarElementForm2SpacingPx({ v, device, state: "normal" })
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
