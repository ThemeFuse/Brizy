import type { GetItems } from "visual/editorComponents/EditorComponent/types";
import { getColor } from "visual/utils/color";
import { t } from "visual/utils/i18n";
import { defaultValueValue } from "visual/utils/onChange";
import { Value } from "./types/Value";

export const getItems: GetItems<Value> = ({ v, device, state }) => {
  const dvv = (key: string) => defaultValueValue({ v, key, device, state });

  const subtotalTitleColor = getColor(
    dvv("subtotalTitleColorPalette"),
    dvv("subtotalTitleColorHex"),
    dvv("subtotalTitleColorOpacity")
  );

  return [
    {
      id: "toolbarTypographySubtotalTitle",
      type: "popover",
      config: {
        icon: "nc-font",
        size: device === "desktop" ? "large" : "auto",
        title: t("Typography")
      },
      position: 10,
      options: [
        {
          id: "subtotalTitleTypography",
          type: "typography",
          config: {
            fontFamily: device === "desktop"
          }
        }
      ]
    },
    {
      id: "toolbarColorSubtotalTitle",
      type: "popover",
      config: {
        size: "auto",
        title: t("Colors"),
        icon: {
          style: {
            backgroundColor: subtotalTitleColor
          }
        }
      },
      devices: "desktop",
      position: 20,
      options: [
        {
          id: "subtotalTitleColor",
          type: "colorPicker"
        }
      ]
    }
  ];
};
