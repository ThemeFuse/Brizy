import { GetItems } from "visual/editorComponents/EditorComponent/types";
import { getColorToolbar } from "visual/utils/color";
import { t } from "visual/utils/i18n";
import { defaultValueValue } from "visual/utils/onChange";
import { HOVER, NORMAL } from "visual/utils/stateMode";
import type { Props, Value } from "../types";

export const getItems: GetItems<Value, Props> = ({ v, device }) => {
  const dvv = (key: string) => defaultValueValue({ v, key, device });

  const calendarHeadingColor = getColorToolbar(
    dvv("calendarHeadingColorPalette"),
    dvv("calendarHeadingColorHex"),
    dvv("calendarHeadingColorOpacity")
  );

  return [
    {
      id: "toolbarTypography",
      type: "popover",
      config: {
        icon: "nc-font",
        size: device === "desktop" ? "large" : "auto",
        title: t("Typography")
      },
      position: 70,
      options: [
        {
          id: "calendarHeadingTypography",
          type: "typography",
          config: {
            fontFamily: device === "desktop"
          }
        }
      ]
    },
    {
      id: "toolbarColor",
      type: "popover",
      devices: "desktop",
      config: {
        title: t("Colors"),
        size: "medium",
        icon: {
          style: {
            backgroundColor: calendarHeadingColor
          }
        }
      },
      position: 80,
      options: [
        {
          id: "calendarHeadingColor",
          type: "colorPicker",
          states: [NORMAL, HOVER]
        }
      ]
    }
  ];
};
