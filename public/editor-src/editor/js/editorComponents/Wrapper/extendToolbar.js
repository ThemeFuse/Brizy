import { t } from "visual/utils/i18n";

import {
  toolbarHorizontalAlign,
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
    toolbarHorizontalAlign({ v, device }),
    {
      id: "toolbarSettings",
      type: "popover",
      title: t("Settings"),
      position: 110,
      options: [
        {
          id: "advancedSettings",
          type: "advancedSettings",
          label: t("More Settings"),
          icon: "nc-cog",
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
      ]
    }
  ];
}

export function getItemsForTablet(v) {
  const device = "tablet";

  return [
    toolbarShowOnTablet({ v }),
    toolbarHorizontalAlign({ v, device }),
    {
      id: "tabletToolbarSettings",
      type: "popover",
      icon: "nc-cog",
      position: 110,
      options: [
        {
          id: "tabletAdvancedSettings",
          type: "advancedSettings",
          sidebarLabel: t("More Settings"),
          label: t("More Settings"),
          icon: "nc-cog",
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
      ]
    }
  ];
}

export function getItemsForMobile(v) {
  const device = "mobile";

  return [
    toolbarShowOnMobile({ v }),
    toolbarHorizontalAlign({ v, device }),
    {
      id: "mobileToolbarSettings",
      type: "popover",
      icon: "nc-cog",
      position: 110,
      options: [
        {
          id: "mobileAdvancedSettings",
          type: "advancedSettings",
          sidebarLabel: t("More Settings"),
          label: t("More Settings"),
          icon: "nc-cog",
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
      ]
    }
  ];
}
