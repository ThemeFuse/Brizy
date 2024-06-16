import { GetItems } from "visual/editorComponents/EditorComponent/types";
import { hexToRgba } from "visual/utils/color";
import { t } from "visual/utils/i18n";
import { defaultValueValue } from "visual/utils/onChange";
import { getOptionColorHexByPalette } from "visual/utils/options";
import { HOVER, NORMAL } from "visual/utils/stateMode";
import type { Props, Value } from "../types";

export const getItems: GetItems<Value, Props> = ({ v, device }) => {
  const dvv = (key: string): unknown => defaultValueValue({ v, key, device });

  const { hex: listPaginationArrowsColorHex } = getOptionColorHexByPalette(
    dvv("listPaginationArrowsColorHex"),
    dvv("listPaginationArrowsColorPalette")
  );
  return [
    {
      id: "toolbarColor",
      type: "popover",
      devices: "desktop",
      config: {
        title: t("Colors"),
        size: "medium",
        icon: {
          style: {
            backgroundColor: hexToRgba(
              listPaginationArrowsColorHex,
              dvv("listPaginationArrowsColorOpacity")
            )
          }
        }
      },
      position: 80,
      options: [
        {
          id: "listPaginationArrowsColor",
          type: "colorPicker",
          states: [NORMAL, HOVER]
        }
      ]
    }
  ];
};
