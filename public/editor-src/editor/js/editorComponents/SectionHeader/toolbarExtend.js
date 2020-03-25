import { t } from "visual/utils/i18n";
import { defaultValueKey } from "visual/utils/onChange";
import {
  toolbarElementSectionHeaderType,
  toolbarElementSectionGlobal,
  toolbarElementSectionSaved,
  toolbarShowOnResponsive
} from "visual/utils/toolbar";

export function getItems({ v, device, component }) {
  const dvk = key => defaultValueKey({ key, device, state: "normal" });

  return [
    toolbarShowOnResponsive({
      v,
      device,
      devices: "responsive",
      closeTooltip: true
    }),
    {
      id: dvk("toolbarSticky"),
      type: "popover",
      icon: "nc-sticky-menu",
      title: t("Menu"),
      devices: "desktop",
      position: 10,
      options: [
        toolbarElementSectionHeaderType({
          v,
          device,
          devices: "desktop",
          state: "normal"
        }),
        toolbarElementSectionGlobal({
          device,
          component,
          state: "normal",
          devices: "desktop"
        })
      ]
    },
    toolbarElementSectionSaved({
      device,
      state: "normal",
      component,
      devices: "desktop"
    })
  ];
}
