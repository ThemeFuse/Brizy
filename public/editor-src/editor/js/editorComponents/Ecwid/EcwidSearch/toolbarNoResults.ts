import { GetItems } from "visual/editorComponents/EditorComponent/types";
import { getColorToolbar } from "visual/utils/color";
import { t } from "visual/utils/i18n";
import { defaultValueValue } from "visual/utils/onChange";
import { HOVER, NORMAL } from "visual/utils/stateMode";
import { noResultsSelector } from "./css/selectors";
import { Value } from "./types";

export const getItems: GetItems<Value> = ({ v, device, state }) => {
  const dvv = (key: string) => defaultValueValue({ v, key, device, state });

  const noResultsColor = getColorToolbar(
    dvv("noResultsColorPalette"),
    dvv("noResultsColorHex"),
    dvv("noResultsColorOpacity")
  );

  return [
    {
      id: "toolbarTypographyRadio",
      type: "popover",
      config: {
        icon: "nc-font",
        size: device === "desktop" ? "large" : "auto",
        title: t("Typography")
      },
      position: 10,
      options: [
        {
          id: "noResultsTypography",
          type: "typography",
          config: {
            fontFamily: device === "desktop"
          },
          selector: noResultsSelector
        }
      ]
    },
    {
      id: "toolbarColor",
      type: "popover",
      config: {
        size: "medium",
        title: t("Colors"),
        icon: {
          style: {
            backgroundColor: noResultsColor
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
              label: t("Text"),
              options: [
                {
                  id: "noResultsColor",
                  type: "colorPicker",
                  states: [NORMAL, HOVER],
                  selector: noResultsSelector
                }
              ]
            },
            {
              id: "tabShadow",
              label: t("Shadow"),
              options: [
                {
                  id: "noResultsTextShadow",
                  type: "textShadow",
                  states: [NORMAL, HOVER],
                  selector: noResultsSelector
                }
              ]
            }
          ]
        }
      ]
    }
  ];
};
