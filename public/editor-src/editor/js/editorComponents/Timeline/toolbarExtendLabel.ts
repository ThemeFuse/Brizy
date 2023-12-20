import type { GetItems } from "visual/editorComponents/EditorComponent/types";
import { hexToRgba } from "visual/utils/color";
import { t } from "visual/utils/i18n";
import { defaultValueValue } from "visual/utils/onChange";
import { getOptionColorHexByPalette } from "visual/utils/options";
import { Props, Value } from "./index";

export const getItems: GetItems<Value, Props> = ({ v, device }) => {
  const dvv = (key: string) => defaultValueValue({ key, v, device });

  const { hex: labelBgColorHex } = getOptionColorHexByPalette(
    dvv("labelBgColorHex"),
    dvv("labelBgColorPalette")
  );
  const { hex: labelColorHex } = getOptionColorHexByPalette(
    dvv("labelColorHex"),
    dvv("labelColorPalette")
  );

  return [
    {
      id: "toolbarTypographyLabel",
      type: "popover-dev",
      config: {
        icon: "nc-font",
        size: device === "desktop" ? "large" : "auto",
        title: t("Typography")
      },
      position: 70,
      options: [
        {
          id: "typography",
          type: "typography-dev",
          config: { fontFamily: device === "desktop" }
        }
      ]
    },
    {
      id: "toolbarColorLabel",
      type: "popover-dev",
      config: {
        size: "medium",
        title: t("Colors"),
        icon: {
          style: {
            backgroundColor:
              dvv("bgColorOpacity") > 0
                ? hexToRgba(labelBgColorHex, dvv("labelBgColorOpacity"))
                : hexToRgba(labelColorHex, dvv("labelColorOpacity"))
          }
        }
      },
      devices: "desktop",
      position: 90,
      options: [
        {
          id: "labelColor",
          type: "colorPicker-dev"
        }
      ]
    },
    {
      id: "toolbarSettings",
      type: "popover-dev",
      config: { title: t("Settings") },
      options: [
        {
          id: "textSpacing",
          label: t("Spacing"),
          type: "slider-dev",
          config: {
            min: -100,
            max: 100,
            units: [{ value: "px", title: "px" }]
          }
        }
      ]
    }
  ];
};
