import { t } from "visual/utils/i18n";
import {
  toolbarElementSectionGlobal,
  toolbarElementSectionSaved,
  toolbarShowOnResponsive
} from "visual/utils/toolbar";

export function getItems({ v, device, component }) {
  return [
    toolbarShowOnResponsive({
      v,
      device,
      devices: "responsive",
      closeTooltip: true
    }),
    {
      id: "toolbarSticky",
      type: "popover-dev",
      config: {
        icon: "nc-sticky-menu",
        title: t("Menu")
      },
      devices: "desktop",
      position: 10,
      options: [
        {
          id: "type",
          label: t("Header"),
          type: "select-dev",
          devices: "desktop",
          choices: [
            { title: t("Static"), value: "static" },
            { title: t("Fixed"), value: "fixed" },
            { title: t("Sticky"), value: "animated" }
          ]
        },
        {
          id: "groupSettings",
          type: "group-dev",
          options: [
            toolbarElementSectionGlobal({
              device,
              component,
              state: "normal",
              devices: "desktop"
            })
          ]
        }
      ]
    },
    toolbarElementSectionSaved({
      device,
      component,
      state: "normal",
      devices: "desktop",
      blockType: "normal"
    })
  ];
}
