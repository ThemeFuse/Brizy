import { t } from "visual/utils/i18n";
import {
  toolbarElementSectionSlider,
  toolbarShowOnDesktop,
  toolbarShowOnResponsive,
  toolbarElementSectionSliderColor,
  toolbarZIndex,
  toolbarMargin,
  toolbarCustomCSSClass,
  toolbarAttributes,
  toolbarElementSectionSaved,
  toolbarElementSectionFullHeight,
  toolbarAnchorName,
  toolbarTags
} from "visual/utils/toolbar";

import { getDynamicContentChoices } from "visual/utils/options";

import { defaultValueKey, defaultValueValue } from "visual/utils/onChange";

export function getItems({ v, device, component }) {
  const dvv = key => defaultValueValue({ v, key, device, state: "normal" });
  const dvk = key => defaultValueKey({ key, device, state: "normal" });

  const cssIDDynamicContentChoices = getDynamicContentChoices("richText");

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
      position: 110,
      options: [
        toolbarElementSectionFullHeight({
          v,
          device,
          devices: "desktop",
          state: "normal"
        }),
        {
          id: dvk("advancedSettings"),
          devices: "desktop",
          type: "advancedSettings",
          sidebarLabel: t("More Settings"),
          label: t("More Settings"),
          icon: "nc-cog",
          options: [
            {
              id: dvk("settingsTabs"),
              type: "tabs",
              align: "start",
              tabs: [
                {
                  id: dvk("settingsStyling"),
                  label: t("Styling"),
                  tabIcon: "nc-styling",
                  options: [
                    toolbarMargin({
                      v,
                      device,
                      state: "normal",
                      devices: "desktop",
                      onChangeGrouped: ["onChangeMarginGrouped"],
                      onChangeUngrouped: ["onChangeMarginUngrouped"]
                    })
                  ]
                },
                {
                  id: dvk("moreSettingsAdvanced"),
                  label: t("Advanced"),
                  tabIcon: "nc-cog",
                  options: [
                    toolbarShowOnDesktop({
                      v,
                      device,
                      closeTooltip: true
                    }),
                    toolbarZIndex({
                      v,
                      device,
                      state: "normal"
                    }),
                    toolbarAnchorName({
                      v,
                      device,
                      devices: "desktop",
                      state: "normal",
                      population: cssIDDynamicContentChoices
                    }),
                    toolbarCustomCSSClass({
                      v,
                      device,
                      devices: "desktop",
                      state: "normal",
                      population: cssIDDynamicContentChoices
                    }),
                    toolbarAttributes({
                      v,
                      device,
                      devices: "desktop",
                      state: "normal"
                    }),
                    toolbarTags({
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
      ]
    },
    {
      id: dvk("advancedSettings"),
      type: "advancedSettings",
      devices: "responsive",
      options: [
        toolbarMargin({
          v,
          device,
          state: "normal",
          devices: "responsive",
          onChangeGrouped: ["onChangeMarginGrouped"],
          onChangeUngrouped: ["onChangeMarginUngrouped"]
        })
      ]
    }
  ];
}
