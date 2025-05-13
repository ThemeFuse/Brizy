import { GetItems } from "visual/editorComponents/EditorComponent/types";
import { getColorToolbar } from "visual/utils/color";
import { t } from "visual/utils/i18n";
import { defaultValueValue } from "visual/utils/onChange";
import { HOVER, NORMAL } from "visual/utils/stateMode";
import { secondaryTextSelectors } from "./css/selectors";
import { Value } from "./types";

export const getItems: GetItems<Value> = ({ v, device, state }) => {
  const dvv = (key: string) => defaultValueValue({ v, key, device, state });

  const secondaryTextColor = getColorToolbar(
    dvv("secondaryTextColorPalette"),
    dvv("secondaryTextColorHex"),
    dvv("secondaryTextColorOpacity")
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
          id: "secondaryTextTypography",
          type: "typography",
          config: {
            fontFamily: device === "desktop"
          },
          selector: secondaryTextSelectors
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
            backgroundColor: secondaryTextColor
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
                  id: "secondaryTextColor",
                  type: "colorPicker",
                  states: [NORMAL, HOVER],
                  selector: secondaryTextSelectors
                }
              ]
            },
            {
              id: "tabShadow",
              label: t("Shadow"),
              options: [
                {
                  id: "secondaryTextTextShadow",
                  type: "textShadow",
                  states: [NORMAL, HOVER],
                  selector: secondaryTextSelectors
                }
              ]
            }
          ]
        }
      ]
    }
  ];
};
