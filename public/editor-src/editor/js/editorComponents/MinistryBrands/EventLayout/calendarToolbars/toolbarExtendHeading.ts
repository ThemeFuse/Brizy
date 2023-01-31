import { GetItems } from "visual/editorComponents/EditorComponent/types";
import { hexToRgba } from "visual/utils/color";
import { t } from "visual/utils/i18n";
import { defaultValueValue } from "visual/utils/onChange";
import { getOptionColorHexByPalette } from "visual/utils/options";
import { HOVER, NORMAL } from "visual/utils/stateMode";
import type { Value, Props } from "../types";

export const getItems: GetItems<Value, Props> = ({ v, device }) => {
  const dvv = (key: string): unknown => defaultValueValue({ v, key, device });

  const { hex: calendarHeadingColorHex } = getOptionColorHexByPalette(
    dvv("calendarHeadingColorHex"),
    dvv("calendarHeadingColorPalette")
  );
  return [
    {
      id: "toolbarTypography",
      type: "popover-dev",
      config: {
        icon: "nc-font",
        size: device === "desktop" ? "large" : "auto",
        title: t("Typography")
      },
      position: 70,
      options: [
        {
          id: "calendarHeadingTypography",
          type: "typography-dev",
          config: {
            fontFamily: device === "desktop"
          }
        }
      ]
    },
    {
      id: "toolbarColor",
      type: "popover-dev",
      devices: "desktop",
      config: {
        title: t("Colors"),
        size: "auto",
        icon: {
          style: {
            backgroundColor: hexToRgba(
              calendarHeadingColorHex,
              dvv("calendarHeadingColorOpacity")
            )
          }
        }
      },
      position: 80,
      options: [
        {
          id: "calendarHeadingColor",
          type: "colorPicker-dev",
          states: [NORMAL, HOVER]
        }
      ]
    }
  ];
};
