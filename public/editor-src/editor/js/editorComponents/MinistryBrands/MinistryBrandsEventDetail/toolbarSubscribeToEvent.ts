import { GetItems } from "visual/editorComponents/EditorComponent/types";
import { hexToRgba } from "visual/utils/color";
import { t } from "visual/utils/i18n";
import { defaultValueValue } from "visual/utils/onChange";
import { getOptionColorHexByPalette } from "visual/utils/options";
import { HOVER, NORMAL } from "visual/utils/stateMode";
import { Props, Value } from "./types";

export const getItems: GetItems<Value, Props> = ({ v, device }) => {
  const dvv = (key: string): unknown => defaultValueValue({ v, key, device });

  const { hex: subscribeEventButtonBgColorHex } = getOptionColorHexByPalette(
    dvv("subscribeEventButtonBgColorHex"),
    dvv("subscribeEventButtonBgColorPalette")
  );
  return [
    {
      id: "toolbarTypography",
      type: "popover",
      config: {
        icon: "nc-font",
        size: device === "desktop" ? "large" : "auto",
        title: t("Typography")
      },
      position: 70,
      options: [
        {
          id: "subscribeEventButtonTypography",
          type: "typography",
          config: {
            fontFamily: device === "desktop"
          }
        }
      ]
    },
    {
      id: "toolbarColor",
      type: "popover",
      config: {
        title: t("Colors"),
        size: "medium",
        icon: {
          style: {
            backgroundColor: hexToRgba(
              subscribeEventButtonBgColorHex,
              dvv("subscribeEventButtonBgColorOpacity")
            )
          }
        }
      },
      devices: "desktop",
      position: 80,
      options: [
        {
          id: "tabsColor",
          type: "tabs",
          tabs: [
            {
              id: "tabBgColor",
              label: t("Bg"),
              options: [
                {
                  id: "subscribeEventButton",
                  type: "backgroundColor",
                  states: [NORMAL, HOVER]
                }
              ]
            },
            {
              id: "tabColor",
              label: t("Text"),
              options: [
                {
                  id: "subscribeEventButtonColor",
                  type: "colorPicker",
                  states: [NORMAL, HOVER]
                }
              ]
            },

            {
              id: "tabBorder",
              label: t("Border"),
              options: [
                {
                  id: "subscribeEventButtonBorder",
                  type: "border",
                  states: [NORMAL, HOVER]
                }
              ]
            },

            {
              id: "tabShadow",
              label: t("Shadow"),
              options: [
                {
                  id: "subscribeEventButtonBoxShadow",
                  type: "boxShadow",
                  states: [NORMAL, HOVER]
                }
              ]
            }
          ]
        }
      ]
    },
    {
      id: "toolbarSettings",
      type: "popover",
      config: {
        icon: "nc-cog",
        title: t("Settings")
      },
      position: 110,
      options: [
        {
          id: "subscribeToEventButtonText",
          devices: "desktop",
          type: "inputText",
          placeholder: t("Button text..."),
          label: t("Button")
        }
      ]
    }
  ];
};
