import { hexToRgba } from "visual/utils/color";
import { t } from "visual/utils/i18n";
import { defaultValueValue } from "visual/utils/onChange";
import { getOptionColorHexByPalette } from "visual/utils/options";
import { HOVER, NORMAL } from "visual/utils/stateMode";
import type { GetItems } from "visual/editorComponents/EditorComponent/types";
import { Value, Props } from "./types";

export const getItems: GetItems<Value, Props> = ({ v, device }) => {
  const dvv = (key: string): unknown => defaultValueValue({ v, key, device });

  const { hex: bgColorHex } = getOptionColorHexByPalette(
    dvv("emptyBgColorHex"),
    dvv("emptyBgColorPalette")
  );
  return [
    {
      id: "toolbarColor",
      type: "popover-dev",
      config: {
        size: "auto",
        title: t("Colors"),
        icon: {
          style: {
            backgroundColor: hexToRgba(bgColorHex, dvv("emptyBgColorOpacity"))
          }
        }
      },
      devices: "desktop",
      position: 10,
      options: [
        { id: "empty", type: "backgroundColor-dev", states: [NORMAL, HOVER] }
      ]
    }
  ];
};
