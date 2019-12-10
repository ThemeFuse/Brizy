import { t } from "visual/utils/i18n";
import { defaultValueKey } from "visual/utils/onChange";
import { getDynamicContentChoices } from "visual/utils/options";
import {
  toolbarElementSectionHeaderType,
  toolbarElementSectionGlobal,
  toolbarElementSectionSaved,
  toolbarShowOnDesktop,
  toolbarShowOnResponsive,
  toolbarAnchorName,
  toolbarCustomCSSClass,
  toolbarAttributes
} from "visual/utils/toolbar";

export function getItems({ v, device, component }) {
  const dvk = key => defaultValueKey({ key, device, state: "normal" });
  const cssIDDynamicContentChoices = getDynamicContentChoices("richText");

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
    }),
    {
      id: dvk("toolbarSettings"),
      type: "popover",
      position: 110,
      title: t("Settings"),
      options: [
        {
          id: dvk("advancedSettings"),
          type: "advancedSettings",
          sidebarLabel: t("More Settings"),
          label: t("More Settings"),
          icon: "nc-cog",
          devices: "desktop",
          options: [
            {
              id: dvk("settingsTabs"),
              type: "tabs",
              align: "start",
              devices: "desktop",
              tabs: [
                {
                  id: dvk("settingsStyling"),
                  label: t("Styling"),
                  tabIcon: "nc-styling",
                  devices: "desktop",
                  options: []
                },
                {
                  id: dvk("moreSettingsAdvanced"),
                  label: t("Advanced"),
                  tabIcon: "nc-cog",
                  devices: "desktop",
                  options: [
                    toolbarShowOnDesktop({
                      v,
                      device,
                      closeTooltip: true
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
                    })
                  ]
                }
              ]
            }
          ]
        }
      ]
    }
  ];
}
