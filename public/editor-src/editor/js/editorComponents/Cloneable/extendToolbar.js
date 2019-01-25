import { t } from "visual/utils/i18n";

import {
  toolbarHorizontalAlign,
  toolbarElementCloneableSpacing,
  toolbarPadding,
  toolbarMargin,
  toolbarShowOnDesktop,
  toolbarZIndex,
  toolbarCustomCSSClass,
  toolbarEntranceAnimation,
  toolbarShowOnTablet,
  toolbarShowOnMobile
} from "visual/utils/toolbar";

export function getItemsForDesktop(v) {
  const device = "desktop";

  return [
    toolbarHorizontalAlign({ v, device }),
    {
      id: "toolbarCurrentShortcode",
      type: "popover",
      options: [
        {
          id: "currentShortcodeTabs",
          className: "",
          type: "tabs",
          tabs: [
            {
              id: "currentShortcodeTab",
              options: [toolbarElementCloneableSpacing({ v })]
            }
          ]
        }
      ]
    },
    {
      id: "advancedSettings",
      type: "advancedSettings",
      sidebarLabel: t("More Settings"),
      roles: ["admin"],
      position: 110,
      icon: "nc-cog",
      title: t("Settings"),
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
  const state = "normal";

  return [
    toolbarShowOnTablet({ v }),
    toolbarHorizontalAlign({ v, device }),
    {
      id: "tabletToolbarSettings",
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
          state,
          onChangeGrouped: ["onChangePaddingGrouped"],
          onChangeUngrouped: ["onChangePaddingUngrouped"]
        }),
        toolbarMargin({
          v,
          device,
          state,
          onChangeGrouped: ["onChangeMarginGrouped"],
          onChangeUngrouped: ["onChangeMarginUngrouped"]
        })
      ]
    }
  ];
}

export function getItemsForMobile(v) {
  const device = "mobile";
  const state = "normal";

  return [
    toolbarShowOnMobile({ v }),
    toolbarHorizontalAlign({ v, device }),
    {
      id: "mobileToolbarSettings",
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
          state,
          onChangeGrouped: ["onChangePaddingGrouped"],
          onChangeUngrouped: ["onChangePaddingUngrouped"]
        }),
        toolbarMargin({
          v,
          device,
          state,
          onChangeGrouped: ["onChangeMarginGrouped"],
          onChangeUngrouped: ["onChangeMarginUngrouped"]
        })
      ]
    }
  ];
}
