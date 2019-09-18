import { t } from "visual/utils/i18n";
import { defaultValueKey } from "visual/utils/onChange";
import {
  toolbarHorizontalAlign,
  toolbarElementCloneableSpacing,
  toolbarPadding,
  toolbarMargin,
  toolbarShowOnDesktop,
  toolbarZIndex,
  toolbarCustomCSSClass,
  toolbarEntranceAnimation,
  toolbarShowOnResponsive
} from "visual/utils/toolbar";

export function getItems({ v, device }) {
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
      id: defaultValueKey({
        key: "toolbarCurrentShortcode",
        device,
        state: "normal"
      }),
      type: "popover",
      options: [
        {
          id: "currentShortcodeTabs",
          className: "",
          type: "tabs",
          tabs: [
            {
              id: "currentShortcodeTab",
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
      id: defaultValueKey({
        key: "advancedSettings",
        device,
        state: "normal"
      }),
      type: "advancedSettings",
      sidebarLabel: t("More Settings"),
      roles: ["admin"],
      position: 110,
      icon: "nc-cog",
      title: t("Settings"),
      options: [
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
        }),
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
                  devices: "desktop",
                  state: "normal",
                  onChangeGrouped: ["onChangePaddingGrouped"],
                  onChangeUngrouped: ["onChangePaddingUngrouped"]
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
              id: defaultValueKey({
                key: "moreSettingsAdvanced",
                device,
                state: "normal"
              }),
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
                toolbarCustomCSSClass({
                  v,
                  device,
                  state: "normal",
                  devices: "desktop"
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
