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

  const { hex: descriptionColorHex } = getOptionColorHexByPalette(
    dvv("descriptionColorHex"),
    dvv("descriptionColorPalette")
  );

  const columns = dvv("columns");

  return [
    {
      id: "toolbarCurrentShortcode",
      type: "popover-dev",
      position: 10,
      config: { icon: "nc-woo-related-products", title: t("Description") },
      devices: "desktop",
      options: [
        {
          id: "positionDescription",
          label: t("Position"),
          type: "slider-dev",
          disabled:
            columns === EcwidProductColumns.ThreeLeft ||
            columns === EcwidProductColumns.ThreeRight ||
            dvv("descriptionPosition") === "besideImage",
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
          id: "descriptionTypography",
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
              descriptionColorHex,
              dvv("descriptionColorOpacity")
            )
          }
        }
      },
      devices: "desktop",
      position: 30,
      options: [
        {
          id: "descriptionColor",
          type: "colorPicker-dev"
        }
      ]
    },
    {
      id: "descriptionHorizontalAlign",
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
      position: 50,
      options: [
        {
          id: "descriptionSpacing",
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
