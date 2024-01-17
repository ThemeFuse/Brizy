import type { GetItems } from "visual/editorComponents/EditorComponent/types";
import { hexToRgba } from "visual/utils/color";
import { t } from "visual/utils/i18n";
import { defaultValueValue } from "visual/utils/onChange";
import { getOptionColorHexByPalette } from "visual/utils/options";
import { HOVER, NORMAL } from "visual/utils/stateMode";
import { EcwidProductColumns, Value } from "./types/Value";

export const getItems: GetItems<Value> = ({ v, device, state }) => {
  const dvv = (key: string) => defaultValueValue({ v, key, device, state });

  const { hex: breadcrumbsColorHex } = getOptionColorHexByPalette(
    dvv("breadcrumbsColorHex"),
    dvv("breadcrumbsColorPalette")
  );

  return [
    {
      id: "toolbarCurrentShortcode",
      type: "popover",
      position: 10,
      config: { icon: "nc-woo-related-products", title: t("Breadcrumbs") },
      devices: "desktop",
      options: [
        {
          id: "positionBreadcrumbs",
          label: t("Position"),
          type: "slider",
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
      type: "popover",
      config: {
        icon: "nc-font",
        size: device === "desktop" ? "large" : "auto",
        title: t("Typography")
      },
      position: 20,
      options: [
        {
          id: "breadcrumbsTypography",
          type: "typography",
          config: { fontFamily: device === "desktop" }
        }
      ]
    },
    {
      id: "toolbarColor",
      type: "popover",
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
          type: "colorPicker",
          states: [NORMAL, HOVER]
        }
      ]
    },
    {
      id: "toolbarSettings",
      type: "popover",
      config: { icon: "nc-cog", title: t("Settings") },
      devices: "desktop",
      position: 50,
      options: [
        {
          id: "breadcrumbsSpacing",
          label: t("Spacing"),
          type: "slider",
          config: {
            min: 0,
            max: 100,
            units: [{ value: "px", title: "px" }]
          }
        }
      ]
    }
  ];
};
