import type { GetItems } from "visual/editorComponents/EditorComponent/types";
import { getColorToolbar } from "visual/utils/color";
import { t } from "visual/utils/i18n";
import { defaultValueValue } from "visual/utils/onChange";
import { ACTIVE, HOVER, NORMAL } from "visual/utils/stateMode";
import { Props, Value } from "./types";

export const getItems: GetItems<Value, Props> = ({ v, device }) => {
  const dvv = (key: string) => defaultValueValue({ v, key, device });

  const dotsBgColor = getColorToolbar(
    dvv("dotsBgColorPalette"),
    dvv("dotsBgColorHex"),
    dvv("dotsBgColorOpacity")
  );

  return [
    {
      id: "toolbarBgColor",
      type: "popover",
      devices: "desktop",
      config: {
        title: t("Bg"),
        size: "medium",
        icon: {
          style: {
            backgroundColor: dotsBgColor
          }
        }
      },
      position: 80,
      options: [
        {
          id: "dots",
          type: "backgroundColor",
          states: [NORMAL, HOVER, ACTIVE]
        }
      ]
    }
  ];
};
