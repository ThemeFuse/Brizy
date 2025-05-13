import { GetItems } from "visual/editorComponents/EditorComponent/types";
import { getColorToolbar } from "visual/utils/color";
import { t } from "visual/utils/i18n";
import { defaultValueValue } from "visual/utils/onChange";
import { HOVER, NORMAL } from "visual/utils/stateMode";
import { getRangeEmptyColorCSS, getRangeFilledColorCSS } from "./css";
import { Value } from "./types";

export const getItems: GetItems<Value> = ({ v, device, state, component }) => {
  const config = component.getGlobalConfig();

  const dvv = (key: string) => defaultValueValue({ v, key, device, state });

  const rangeColor = getColorToolbar(
    dvv("rangeColorPalette"),
    dvv("rangeColorHex"),
    dvv("rangeColorOpacity")
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
            backgroundColor: rangeColor
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
              id: "tabColor",
              label: t("Empty"),
              options: [
                {
                  id: "rangeEmptySliderColor",
                  type: "colorPicker",
                  states: [NORMAL, HOVER],
                  style: getRangeEmptyColorCSS(config)
                }
              ]
            },
            {
              id: "tabBackground",
              label: t("Filled"),
              options: [
                {
                  id: "rangeFilledSliderColor",
                  type: "colorPicker",
                  states: [NORMAL, HOVER],
                  style: getRangeFilledColorCSS(config)
                }
              ]
            }
          ]
        }
      ]
    }
  ];
};
