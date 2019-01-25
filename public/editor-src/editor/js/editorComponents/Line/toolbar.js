import { hexToRgba } from "visual/utils/color";
import { getOptionColor } from "visual/utils/options";
import { t } from "visual/utils/i18n";
import {
  toolbarElementLineBorderStyle,
  toolbarElementLineBorderWidth,
  toolbarBorderColorHexAndOpacity,
  toolbarBorderColorPalette,
  toolbarBorderColorFields,
  toolbarSizeWidthWidthPercent
} from "visual/utils/toolbar";

export function getItemsForDesktop(v) {
  const device = "desktop";
  const { hex: borderColorHex } = getOptionColor(v, "borderColor");

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
        toolbarBorderColorFields({
          v,
          device,
          onChange: [
            "onChangeBorderColorHexAndOpacity",
            "onChangeBorderColorHexAndOpacityPalette"
          ]
        })
      ]
    },
    {
      id: "toolbarSettings",
      type: "popover",
      icon: "nc-cog",
      title: t("Settings"),
      roles: ["admin"],
      position: 110,
      options: [toolbarSizeWidthWidthPercent({ v, device })]
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
