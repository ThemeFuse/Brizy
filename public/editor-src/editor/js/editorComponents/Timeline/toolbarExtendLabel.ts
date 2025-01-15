import type { GetItems } from "visual/editorComponents/EditorComponent/types";
import { getColor } from "visual/utils/color";
import { t } from "visual/utils/i18n";
import { defaultValueValue } from "visual/utils/onChange";
import { Props, Value } from "./index";

export const getItems: GetItems<Value, Props> = ({ v, device }) => {
  const dvv = (key: string) => defaultValueValue({ key, v, device });

  const labelBgColorOpacity = dvv("labelBgColorOpacity");
  const labelBgColor = getColor(
    dvv("labelBgColorPalette"),
    dvv("labelBgColorHex"),
    labelBgColorOpacity
  );
  const labelColor = getColor(
    dvv("labelColorPalette"),
    dvv("labelColorHex"),
    dvv("labelColorOpacity")
  );

  return [
    {
      id: "toolbarTypographyLabel",
      type: "popover",
      config: {
        icon: "nc-font",
        size: device === "desktop" ? "large" : "auto",
        title: t("Typography")
      },
      position: 70,
      options: [
        {
          id: "typography",
          type: "typography",
          config: { fontFamily: device === "desktop" }
        }
      ]
    },
    {
      id: "toolbarColorLabel",
      type: "popover",
      config: {
        size: "medium",
        title: t("Colors"),
        icon: {
          style: {
            backgroundColor: labelBgColorOpacity ? labelBgColor : labelColor
          }
        }
      },
      devices: "desktop",
      position: 90,
      options: [
        {
          id: "labelColor",
          type: "colorPicker"
        }
      ]
    },
    {
      id: "toolbarSettings",
      type: "popover",
      config: { title: t("Settings") },
      options: [
        {
          id: "textSpacing",
          label: t("Spacing"),
          type: "slider",
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
