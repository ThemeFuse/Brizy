import { t } from "visual/utils/i18n";
import {
  toolbarElementEmbedCode,
  toolbarSizeWidthWidthPercent,
  toolbarCustomCSS
} from "visual/utils/toolbar";

export function getItemsForDesktop(v) {
  const device = "desktop";
  return [
    {
      id: "toolbarCode",
      type: "popover",
      icon: "nc-iframe",
      size: "large",
      title: t("Embed"),
      roles: ["admin"],
      position: 90,
      options: [toolbarElementEmbedCode({ v })]
    },
    {
      id: "toolbarSettings",
      type: "popover",
      icon: "nc-cog",
      title: t("Settings"),
      roles: ["admin"],
      position: 110,
      options: [
        toolbarSizeWidthWidthPercent({ v, device, state: "normal" }),
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
                  options: []
                },
                {
                  id: "moreSettingsAdvanced",
                  label: t("Advanced"),
                  tabIcon: "nc-cog",
                  options: [toolbarCustomCSS({ v })]
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
  const state = "normal";
  return [
    {
      id: "tabletToolbarSettings",
      type: "popover",
      icon: "nc-cog",
      title: t("Settings"),
      roles: ["admin"],
      position: 110,
      options: [toolbarSizeWidthWidthPercent({ v, device, state })]
    }
  ];
}

export function getItemsForMobile(v) {
  const device = "mobile";
  const state = "normal";
  return [
    {
      id: "mobileToolbarSettings",
      type: "popover",
      icon: "nc-cog",
      title: t("Settings"),
      roles: ["admin"],
      position: 110,
      options: [toolbarSizeWidthWidthPercent({ v, device, state })]
    }
  ];
}
