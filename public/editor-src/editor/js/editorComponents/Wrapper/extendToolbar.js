import { t } from "visual/utils/i18n";

import {
  toolbarHorizontalAlign,
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
    toolbarShowOnResponsive({
      v,
      device,
      state: "normal",
      devices: "responsive"
    }),
    toolbarHorizontalAlign({ v, device }),
    {
      id: defaultValueKey({ key: "toolbarSettings", device }),
      type: "popover",
      title: t("Settings"),
      position: 110,
      options: [
        {
          id: defaultValueKey({ key: "advancedSettings", device }),
          type: "advancedSettings",
          label: t("More Settings"),
          icon: "nc-cog",
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
                  devices: "desktop",
                  options: [
                    toolbarShowOnDesktop({ v, device }),
                    toolbarZIndex({ v, device }),
                    toolbarCustomCSSClass({ v, device }),
                    toolbarEntranceAnimation({ v, device })
                  ]
                }
              ]
            },
            toolbarPadding({
              v,
              device,
              devices: "responsive",
              state: "normal",
              onChangeGrouped: ["onChangePaddingGrouped"],
              onChangeUngrouped: ["onChangePaddingUngrouped"]
            }),
            toolbarMargin({
              v,
              device,
              devices: "responsive",
              state: "normal",
              onChangeGrouped: ["onChangeMarginGrouped"],
              onChangeUngrouped: ["onChangeMarginUngrouped"]
            })
          ]
        }
      ]
    }
  ];
}
