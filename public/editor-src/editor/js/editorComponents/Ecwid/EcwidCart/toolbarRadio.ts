import type { GetItems } from "visual/editorComponents/EditorComponent/types";
import { getColorToolbar } from "visual/utils/color";
import { t } from "visual/utils/i18n";
import { defaultValueValue } from "visual/utils/onChange";
import { ACTIVE, HOVER, NORMAL } from "visual/utils/stateMode";
import type { Value } from "./types/Value";

export const getItems: GetItems<Value> = ({ v, device, state }) => {
  const dvv = (key: string) => defaultValueValue({ v, key, device, state });

  const radioColor = getColorToolbar(
    dvv("radioColorPalette"),
    dvv("radioColorHex"),
    dvv("radioColorOpacity")
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
            backgroundColor: radioColor
          }
        }
      },
      devices: "desktop",
      position: 20,
      options: [
        {
          id: "tabsColor",
          type: "tabs",
          tabs: [
            {
              id: "tabBackground",
              label: t("Background"),
              options: [
                {
                  id: "radio",
                  type: "backgroundColor"
                }
              ]
            },
            {
              id: "tabBorder",
              label: t("Border"),
              options: [
                {
                  id: "radioBorder",
                  type: "border",
                  states: [NORMAL, HOVER, ACTIVE]
                }
              ]
            }
          ]
        }
      ]
    }
  ];
};
