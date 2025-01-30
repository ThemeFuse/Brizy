import type { GetItems } from "visual/editorComponents/EditorComponent/types";
import { getColorToolbar } from "visual/utils/color";
import { t } from "visual/utils/i18n";
import { defaultValueValue } from "visual/utils/onChange";
import { HOVER, NORMAL } from "visual/utils/stateMode";
import { Props, Value } from "./types";

export const getItems: GetItems<Value, Props> = ({ v, device }) => {
  const dvv = (key: string) => defaultValueValue({ v, key, device });

  const bgColor = getColorToolbar(
    dvv("emptyBgColorPalette"),
    dvv("emptyBgColorHex"),
    dvv("emptyBgColorOpacity")
  );

  return [
    {
      id: "toolbarColor",
      type: "popover",
      config: {
        size: "medium",
        title: t("Colors"),
        icon: {
          style: {
            backgroundColor: bgColor
          }
        }
      },
      devices: "desktop",
      position: 10,
      options: [
        { id: "empty", type: "backgroundColor", states: [NORMAL, HOVER] }
      ]
    }
  ];
};
