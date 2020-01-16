import { t } from "visual/utils/i18n";
import { defaultValueKey } from "visual/utils/onChange";
import {
  toolbarHorizontalAlign,
  toolbarElementCloneableSpacing,
  toolbarPaddingFourFields,
  toolbarMargin,
  toolbarShowOnDesktop,
  toolbarZIndex,
  toolbarCSSID,
  toolbarCustomCSSClass,
  toolbarEntranceAnimation,
  toolbarShowOnResponsive
} from "visual/utils/toolbar";
import { getDynamicContentChoices } from "visual/utils/options";

export function getItems({ v, device }) {
  const dvk = key => defaultValueKey({ key, device, state: "normal" });
  const cssIDDynamicContentChoices = getDynamicContentChoices("richText");

  return [
    toolbarHorizontalAlign({
      v,
      device,
      state: "normal"
    }),
    toolbarShowOnResponsive({
      v,
      device,
      state: "normal",
      devices: "responsive"
    }),
    {
      id: dvk("toolbarCurrentShortcode"),
      type: "popover",
      options: [
        {
          id: dvk("currentShortcodeTabs"),
          type: "tabs",
          tabs: [
            {
              id: dvk("currentShortcodeTab"),
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
    },
    {
      id: dvk("advancedSettings"),
      type: "advancedSettings",
      sidebarLabel: t("More Settings"),
      roles: ["admin"],
      position: 110,
      icon: "nc-cog",
      title: t("Settings"),
      options: [
        toolbarPaddingFourFields({
          v,
          device,
          state: "normal",
          devices: "responsive"
        }),
        toolbarMargin({
          v,
          device,
          devices: "responsive",
          state: "normal",
          onChangeGrouped: ["onChangeMarginGrouped"],
          onChangeUngrouped: ["onChangeMarginUngrouped"]
        }),
        {
          id: dvk("settingsTabs"),
          type: "tabs",
          devices: "desktop",
          align: "start",
          tabs: [
            {
              id: dvk("settingsStyling"),
              label: t("Styling"),
              tabIcon: "nc-styling",
              options: [
                toolbarPaddingFourFields({
                  v,
                  device,
                  state: "normal",
                  devices: "desktop"
                }),
                toolbarMargin({
                  v,
                  device,
                  devices: "desktop",
                  state: "normal",
                  onChangeGrouped: ["onChangeMarginGrouped"],
                  onChangeUngrouped: ["onChangeMarginUngrouped"]
                })
              ]
            },
            {
              id: dvk("moreSettingsAdvanced"),
              label: t("Advanced"),
              devices: "desktop",
              tabIcon: "nc-cog",
              options: [
                toolbarShowOnDesktop({
                  v,
                  device,
                  state: "normal",
                  devices: "desktop"
                }),
                toolbarZIndex({
                  v,
                  device,
                  state: "normal",
                  devices: "desktop"
                }),
                toolbarCSSID({
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
                toolbarEntranceAnimation({
                  v,
                  device,
                  state: "normal",
                  devices: "desktop"
                })
              ]
            }
          ]
        }
      ]
    }
  ];
}
