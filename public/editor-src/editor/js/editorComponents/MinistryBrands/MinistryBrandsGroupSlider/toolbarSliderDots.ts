import type { GetItems } from "visual/editorComponents/EditorComponent/types";
import { hexToRgba } from "visual/utils/color";
import { t } from "visual/utils/i18n";
import { defaultValueValue } from "visual/utils/onChange";
import { getOptionColorHexByPalette } from "visual/utils/options";
import { ACTIVE, HOVER, NORMAL } from "visual/utils/stateMode";
import { Props, Value } from "./types";

export const getItems: GetItems<Value, Props> = ({ v, device }) => {
  const dvv = (key: string): unknown => defaultValueValue({ v, key, device });

  const { hex: dotsBgColorHex } = getOptionColorHexByPalette(
    dvv("dotsBgColorHex"),
    dvv("dotsBgColorPalette")
  );
  return [
    {
      id: "toolbarBgColor",
      type: "popover-dev",
      devices: "desktop",
      config: {
        title: t("Bg"),
        size: "medium",
        icon: {
          style: {
            backgroundColor: hexToRgba(
              dotsBgColorHex,
              dvv("dotsBgColorOpacity")
            )
          }
        }
      },
      position: 80,
      options: [
        {
          id: "dots",
          type: "backgroundColor-dev",
          states: [NORMAL, HOVER, ACTIVE]
        }
      ]
    }
  ];
};
