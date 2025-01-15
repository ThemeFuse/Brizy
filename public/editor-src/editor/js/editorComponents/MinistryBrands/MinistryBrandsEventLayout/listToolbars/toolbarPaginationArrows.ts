import { GetItems } from "visual/editorComponents/EditorComponent/types";
import { getColor } from "visual/utils/color";
import { t } from "visual/utils/i18n";
import { defaultValueValue } from "visual/utils/onChange";
import { HOVER, NORMAL } from "visual/utils/stateMode";
import type { Props, Value } from "../types";

export const getItems: GetItems<Value, Props> = ({ v, device }) => {
  const dvv = (key: string) => defaultValueValue({ v, key, device });

  const listPaginationArrowsColor = getColor(
    dvv("listPaginationArrowsColorPalette"),
    dvv("listPaginationArrowsColorHex"),
    dvv("listPaginationArrowsColorOpacity")
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
            backgroundColor: listPaginationArrowsColor
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
