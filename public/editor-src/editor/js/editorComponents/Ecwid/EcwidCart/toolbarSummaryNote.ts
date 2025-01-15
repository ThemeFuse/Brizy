import type { GetItems } from "visual/editorComponents/EditorComponent/types";
import { getColor } from "visual/utils/color";
import { t } from "visual/utils/i18n";
import { defaultValueValue } from "visual/utils/onChange";
import { Value } from "./types/Value";

export const getItems: GetItems<Value> = ({ v, device, state }) => {
  const dvv = (key: string) => defaultValueValue({ v, key, device, state });

  const summaryNoteColor = getColor(
    dvv("summaryNoteColorPalette"),
    dvv("summaryNoteColorHex"),
    dvv("summaryNoteColorOpacity")
  );

  return [
    {
      id: "toolbarTypographySummaryNote",
      type: "popover",
      config: {
        icon: "nc-font",
        size: device === "desktop" ? "large" : "auto",
        title: t("Typography")
      },
      position: 10,
      options: [
        {
          id: "summaryNoteTypography",
          type: "typography",
          config: {
            fontFamily: device === "desktop"
          }
        }
      ]
    },
    {
      id: "toolbarColorSummaryNote",
      type: "popover",
      config: {
        size: "auto",
        title: t("Colors"),
        icon: {
          style: {
            backgroundColor: summaryNoteColor
          }
        }
      },
      devices: "desktop",
      position: 20,
      options: [
        {
          id: "summaryNoteColor",
          type: "colorPicker"
        }
      ]
    }
  ];
};
