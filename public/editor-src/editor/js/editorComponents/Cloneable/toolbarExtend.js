import { t } from "visual/utils/i18n";
import {
  toolbarElementCloneableSpacing,
  toolbarShowOnResponsive
} from "visual/utils/toolbar";

export function getItems({ v, device }) {
  return [
    {
      id: "horizontalAlign",
      type: "toggle-dev",
      position: 100,
      choices: [
        { icon: "nc-text-align-left", title: t("Align"), value: "left" },
        { icon: "nc-text-align-center", title: t("Align"), value: "center" },
        { icon: "nc-text-align-right", title: t("Align"), value: "right" }
      ]
    },
    toolbarShowOnResponsive({
      v,
      device,
      state: "normal",
      devices: "responsive"
    }),
    {
      id: "toolbarCurrentShortcode",
      type: "popover-dev",
      options: [
        {
          id: "currentShortcodeTabs",
          type: "tabs-dev",
          tabs: [
            {
              id: "currentShortcodeTab",
              options: [
                toolbarElementCloneableSpacing({
                  v,
                  device,
                  state: "normal"
                })
              ]
            }
          ]
        }
      ]
    }
  ];
}
