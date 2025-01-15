import type { GetItems } from "visual/editorComponents/EditorComponent/types";
import { getColor } from "visual/utils/color";
import { t } from "visual/utils/i18n";
import { defaultValueValue } from "visual/utils/onChange";
import { HOVER, NORMAL } from "visual/utils/stateMode";
import { buttonIconSelector, buttonSelector } from "./css/selectors";
import type { Value } from "./types";

export const getItems: GetItems<Value> = ({ v, device, state }) => {
  const dvv = (key: string) => defaultValueValue({ v, key, device, state });

  const titleColor = getColor(
    dvv("titleColorPalette"),
    dvv("titleColorHex"),
    dvv("titleColorOpacity")
  );

  return [
    {
      id: "toolbarTypographyButton",
      type: "popover",
      config: {
        icon: "nc-font",
        size: device === "desktop" ? "large" : "auto",
        title: t("Typography")
      },
      position: 10,
      options: [
        {
          id: "buttonTypography",
          type: "typography",
          config: {
            fontFamily: device === "desktop"
          },
          selector: buttonSelector
        }
      ]
    },
    {
      id: "toolbarColorButtons",
      type: "popover",
      config: {
        size: "medium",
        title: t("Colors"),
        icon: {
          style: {
            backgroundColor: titleColor
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
              id: "tabColorText",
              label: t("Text"),
              options: [
                {
                  id: "buttonTextColor",
                  type: "colorPicker",
                  states: [NORMAL, HOVER],
                  selector: buttonSelector
                }
              ]
            },
            {
              id: "tabColorIcon",
              label: t("Icon"),
              options: [
                {
                  id: "buttonIconColor",
                  type: "colorPicker",
                  states: [NORMAL, HOVER],
                  selector: buttonIconSelector
                }
              ]
            },
            {
              id: "tabColorBg",
              label: t("Background"),
              options: [
                {
                  id: "button",
                  type: "backgroundColor",
                  states: [NORMAL, HOVER],
                  selector: buttonSelector
                }
              ]
            },
            {
              id: "tabShadow",
              label: t("Shadow"),
              options: [
                {
                  id: "buttonBoxShadow",
                  type: "boxShadow",
                  states: [NORMAL, HOVER],
                  selector: buttonSelector
                }
              ]
            }
          ]
        }
      ]
    },
    {
      id: "advancedSettings",
      type: "advancedSettings",
      title: t("Settings"),
      position: 110,
      devices: "desktop"
    }
  ];
};
