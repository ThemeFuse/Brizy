import { hexToRgba } from "visual/utils/color";
import { getOptionColorHexByPalette } from "visual/utils/options";
import { defaultValueValue } from "visual/utils/onChange";
import { t } from "visual/utils/i18n";
import {
  toolbarElementLineBorderStyle,
  toolbarElementLineBorderWidth,
  toolbarBorderColorHexAndOpacity,
  toolbarBorderColorPalette,
  toolbarBorderColorFields,
  toolbarSizeWidthWidthPercent,
  toolbarCustomCSS
} from "visual/utils/toolbar";

export function getItemsForDesktop(v) {
  const device = "desktop";

  const { hex: borderColorHex } = getOptionColorHexByPalette(
    defaultValueValue({ v, key: "borderColorHex", device }),
    defaultValueValue({ v, key: "borderColorPalette", device })
  );

  return [
    {
      id: "toolbarLine",
      type: "popover",
      icon: "nc-divider",
      title: t("Line"),
      position: 80,
      options: [
        toolbarElementLineBorderStyle({ v }),
        toolbarElementLineBorderWidth({ v, device })
      ]
    },
    {
      id: "toolbarColor",
      type: "popover",
      size: "auto",
      title: t("Colors"),
      roles: ["admin"],
      position: 90,
      icon: {
        style: {
          backgroundColor: hexToRgba(borderColorHex, v.borderColorOpacity)
        }
      },
      options: [
        toolbarBorderColorHexAndOpacity({
          v,
          device,
          onChange: [
            "onChangeBorderColorHexAndOpacity",
            "onChangeBorderColorHexAndOpacityPalette"
          ]
        }),
        toolbarBorderColorPalette({
          v,
          device,
          onChange: [
            "onChangeBorderColorPalette",
            "onChangeBorderColorPaletteOpacity"
          ]
        }),
        {
          type: "grid",
          className: "brz-ed-grid__color-fileds",
          columns: [
            {
              width: 100,
              options: [
                toolbarBorderColorFields({
                  v,
                  device,
                  onChange: [
                    "onChangeBorderColorHexAndOpacity",
                    "onChangeBorderColorHexAndOpacityPalette"
                  ]
                })
              ]
            }
          ]
        }
      ]
    },
    {
      id: "toolbarSettings",
      type: "popover",
      icon: "nc-cog",
      title: t("Settings"),
      roles: ["admin"],
      position: 110,
      options: [
        toolbarSizeWidthWidthPercent({ v, device }),
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
                  options: []
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
    {
      id: "tabletToolbarLine",
      type: "popover",
      icon: "nc-divider",
      title: t("Line"),
      roles: ["admin"],
      position: 90,
      options: [toolbarElementLineBorderWidth({ v, device })]
    },
    {
      id: "tabletToolbarSettings",
      type: "popover",
      icon: "nc-cog",
      title: t("Settings"),
      roles: ["admin"],
      position: 110,
      options: [toolbarSizeWidthWidthPercent({ v, device })]
    }
  ];
}

export function getItemsForMobile(v) {
  const device = "mobile";
  return [
    {
      id: "mobileToolbarLine",
      type: "popover",
      icon: "nc-divider",
      title: t("Line"),
      roles: ["admin"],
      position: 90,
      options: [toolbarElementLineBorderWidth({ v, device })]
    },
    {
      id: "mobileToolbarSettings",
      type: "popover",
      icon: "nc-cog",
      title: t("Settings"),
      roles: ["admin"],
      position: 110,
      options: [toolbarSizeWidthWidthPercent({ v, device })]
    }
  ];
}
