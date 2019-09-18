import { t } from "visual/utils/i18n";

import {
  toolbarPadding,
  toolbarMargin,
  toolbarShowOnDesktop,
  toolbarShowOnResponsive,
  toolbarZIndex,
  toolbarCustomCSSClass,
  toolbarEntranceAnimation
} from "visual/utils/toolbar";
import { defaultValueKey } from "visual/utils/onChange";

export function getItems({ v, device }) {
  return [
    toolbarShowOnResponsive({ v, device, devices: "responsive" }),
    {
      id: defaultValueKey({ key: "advancedSettings", device }),
      type: "advancedSettings",
      sidebarLabel: t("More Settings"),
      icon: "nc-cog",
      title: t("Settings"),
      roles: ["admin"],
      position: 110,
      options: [
        {
          id: "settingsTabs",
          type: "tabs",
          devices: "desktop",
          align: "start",
          tabs: [
            {
              id: "settingsStyling",
              label: t("Styling"),
              tabIcon: "nc-styling",
              options: [
                toolbarPadding({
                  v,
                  device,
                  state: "normal",
                  onChangeGrouped: ["onChangePaddingGrouped"],
                  onChangeUngrouped: ["onChangePaddingUngrouped"]
                }),
                toolbarMargin({
                  v,
                  device,
                  state: "normal",
                  onChangeGrouped: ["onChangeMarginGrouped"],
                  onChangeUngrouped: ["onChangeMarginUngrouped"]
                })
              ]
            },
            {
              id: "moreSettingsAdvanced",
              label: t("Advanced"),
              tabIcon: "nc-cog",
              device: "desktop",
              options: [
                toolbarShowOnDesktop({ v }),
                toolbarZIndex({ v }),
                toolbarCustomCSSClass({ v }),
                toolbarEntranceAnimation({ v })
              ]
            }
          ]
        },
        toolbarPadding({
          v,
          device,
          devices: "responsive",
          onChangeGrouped: ["onChangePaddingGrouped"],
          onChangeUngrouped: ["onChangePaddingUngrouped"]
        }),
        toolbarMargin({
          v,
          device,
          devices: "responsive",
          onChangeGrouped: ["onChangeMarginGrouped"],
          onChangeUngrouped: ["onChangeMarginUngrouped"]
        })
      ]
    }
  ];
}
