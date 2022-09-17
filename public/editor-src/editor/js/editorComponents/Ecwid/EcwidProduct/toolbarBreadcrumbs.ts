import { ToolbarItemType } from "visual/editorComponents/ToolbarItemType";
import { hexToRgba } from "visual/utils/color";
import { t } from "visual/utils/i18n";
import { defaultValueValue } from "visual/utils/onChange";
import { getOptionColorHexByPalette } from "visual/utils/options";
import { ResponsiveMode } from "visual/utils/responsiveMode";
import { EcwidProductColumns, Value } from "./types/Value";

export function getItems({
  v,
  device
}: {
  v: Value;
  device: ResponsiveMode;
}): ToolbarItemType[] {
  const dvv = (key: string) =>
    defaultValueValue({ v, key, device, state: "normal" });

  const { hex: breadcrumbsColorHex } = getOptionColorHexByPalette(
    dvv("breadcrumbsColorHex"),
    dvv("breadcrumbsColorPalette")
  );

  return [
    {
      id: "toolbarCurrentShortcode",
      type: "popover-dev",
      position: 10,
      config: { icon: "nc-woo-related-products", title: t("Breadcrumbs") },
      devices: "desktop",
      options: [
        {
          id: "positionBreadcrumbs",
          label: t("Position"),
          type: "slider-dev",
          disabled: dvv("columns") === EcwidProductColumns.ThreeRight,
          config: {
            min: 100,
            max: 1000,
            step: 100
          }
        }
      ]
    },
    {
      id: "toolbarTypography",
      type: "popover-dev",
      config: {
        icon: "nc-font",
        size: device === "desktop" ? "large" : "auto",
        title: t("Typography")
      },
      position: 20,
      options: [
        {
          id: "breadcrumbsTypography",
          type: "typography-dev",
          config: { fontFamily: device === "desktop" }
        }
      ]
    },
    {
      id: "toolbarColor",
      type: "popover-dev",
      config: {
        size: "auto",
        title: t("Colors"),
        icon: {
          style: {
            backgroundColor: hexToRgba(
              breadcrumbsColorHex,
              dvv("breadcrumbsColorOpacity")
            )
          }
        }
      },
      devices: "desktop",
      position: 30,
      options: [
        {
          id: "breadcrumbsColor",
          type: "colorPicker-dev"
        }
      ]
    },
    {
      id: "breadcrumbsHorizontalAlign",
      type: "toggle-dev",
      position: 40,
      choices: [
        { icon: "nc-text-align-left", title: t("Align"), value: "left" },
        { icon: "nc-text-align-center", title: t("Align"), value: "center" },
        { icon: "nc-text-align-right", title: t("Align"), value: "right" }
      ]
    },
    {
      id: "toolbarSettings",
      type: "popover-dev",
      config: { icon: "nc-cog", title: t("Settings") },
      devices: "desktop",
      position: 50,
      options: [
        {
          id: "breadcrumbsSpacing",
          label: t("Spacing"),
          type: "slider-dev",
          config: {
            min: 0,
            max: 100,
            units: [{ value: "px", title: "px" }]
          }
        }
      ]
    }
  ];
}
