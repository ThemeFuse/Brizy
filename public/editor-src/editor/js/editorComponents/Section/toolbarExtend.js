import { t } from "visual/utils/i18n";
import {
  toolbarElementSectionSlider,
  toolbarShowOnResponsive,
  toolbarElementSectionSliderColor,
  toolbarElementSectionSaved,
  toolbarElementSectionHeightStyle,
  toolbarVerticalAlign
} from "visual/utils/toolbar";
import { defaultValueKey, defaultValueValue } from "visual/utils/onChange";

export function getItems({ v, device, component }) {
  const dvv = key => defaultValueValue({ v, key, device, state: "normal" });
  const dvk = key => defaultValueKey({ key, device, state: "normal" });

  return [
    toolbarShowOnResponsive({
      v,
      device,
      devices: "responsive",
      closeTooltip: true
    }),
    toolbarElementSectionSlider({
      v,
      component,
      device,
      devices: "desktop",
      state: "normal"
    }),
    {
      id: dvk("toolbarColor"),
      type: "popover",
      size: "auto",
      position: 90,
      devices: "desktop",
      options: [
        {
          id: dvk("tabsState"),
          tabsPosition: "left",
          type: "tabs",
          value: dvv("tabsState"),
          tabs: [
            {
              id: dvk("tabNormal"),
              tabIcon: "nc-circle",
              title: t("Normal"),
              options: [
                toolbarElementSectionSliderColor({
                  v,
                  device,
                  state: "normal"
                })
              ]
            },
            {
              id: dvk("tabHover"),
              tabIcon: "nc-hover",
              title: t("Hover"),
              options: [
                toolbarElementSectionSliderColor({
                  v,
                  device,
                  devices: "desktop",
                  state: "hover"
                })
              ]
            }
          ]
        }
      ]
    },
    toolbarElementSectionSaved({
      device,
      component,
      devices: "desktop",
      state: "normal"
    }),
    {
      id: dvk("toolbarSettings"),
      type: "popover",
      options: [
        toolbarElementSectionHeightStyle({
          v,
          device,
          devices: "desktop",
          state: "normal"
        }),
        toolbarVerticalAlign({
          v,
          device,
          devices: "desktop",
          state: "normal",
          disabled: dvv("fullHeight") === "off"
        })
      ]
    }
  ];
}
