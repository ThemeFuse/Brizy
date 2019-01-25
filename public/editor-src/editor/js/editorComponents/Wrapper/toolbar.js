import { t } from "visual/utils/i18n";

import {
  toolbarPadding,
  toolbarMargin,
  toolbarShowOnDesktop,
  toolbarShowOnTablet,
  toolbarShowOnMobile,
  toolbarZIndex,
  toolbarCustomCSSClass,
  toolbarEntranceAnimation
} from "visual/utils/toolbar";

export function getItemsForDesktop(v) {
  const device = "desktop";

  return [
    {
      id: "advancedSettings",
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
              options: [
                toolbarShowOnDesktop({ v }),
                toolbarZIndex({ v }),
                toolbarCustomCSSClass({ v }),
                toolbarEntranceAnimation({ v })
              ]
            }
          ]
        }
      ]
    }
  ];
}

export function getItemsForTablet(v) {
  const device = "tablet";

  return [
    toolbarShowOnTablet({ v }),
    {
      id: "tabletAdvancedSettings",
      type: "advancedSettings",
      sidebarLabel: t("More Settings"),
      icon: "nc-cog",
      roles: ["admin"],
      position: 110,
      title: t("Settings"),
      options: [
        toolbarPadding({
          v,
          device,
          onChangeGrouped: ["onChangePaddingGrouped"],
          onChangeUngrouped: ["onChangePaddingUngrouped"]
        }),
        toolbarMargin({
          v,
          device,
          onChangeGrouped: ["onChangeMarginGrouped"],
          onChangeUngrouped: ["onChangeMarginUngrouped"]
        })
      ]
    }
  ];
}

export function getItemsForMobile(v) {
  const device = "mobile";

  return [
    toolbarShowOnMobile({ v }),
    {
      id: "mobileAdvancedSettings",
      type: "advancedSettings",
      sidebarLabel: t("More Settings"),
      icon: "nc-cog",
      title: t("Settings"),
      roles: ["admin"],
      position: 110,
      options: [
        toolbarPadding({
          v,
          device,
          onChangeGrouped: ["onChangePaddingGrouped"],
          onChangeUngrouped: ["onChangePaddingUngrouped"]
        }),
        toolbarMargin({
          v,
          device,
          onChangeGrouped: ["onChangeMarginGrouped"],
          onChangeUngrouped: ["onChangeMarginUngrouped"]
        })
      ]
    }
  ];
}
