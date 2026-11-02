import type { GetItems } from "visual/editorComponents/EditorComponent/types";
import { getColorToolbar } from "visual/utils/color";
import { t } from "visual/utils/i18n";
import { defaultValueValue } from "visual/utils/onChange";
import { HOVER, NORMAL } from "visual/utils/stateMode";
import {
  buttonBgColorCSS,
  buttonPaddingRLCSS,
  buttonPaddingTBCSS,
  buttonSelector,
  buttonSizeCSS,
  buttonTextColorCSS
} from "./css";
import type { Props, Value } from "./types";

export const getItems: GetItems<Value, Props> = ({ v, device, component }) => {
  const dvv = (key: string) => defaultValueValue({ v, key, device });
  const config = component.getGlobalConfig();
  const selector = buttonSelector("accept");
  const paddingDisabled = dvv("acceptButtonSize") !== "custom";

  const bgColorSwatch = getColorToolbar(
    dvv("acceptButtonBgColorPalette"),
    dvv("acceptButtonBgColorHex"),
    dvv("acceptButtonBgColorOpacity")
  );

  return [
    {
      id: "acceptButtonSizePopover",
      type: "popover",
      config: {
        icon: "nc-button",
        title: t("Button")
      },
      position: 60,
      options: [
        {
          id: "acceptButtonSizeGroup",
          type: "group",
          options: [
            {
              id: "acceptButtonSize",
              label: t("Size"),
              type: "radioGroup",
              choices: [
                { value: "small", icon: "nc-small" },
                { value: "medium", icon: "nc-medium" },
                { value: "large", icon: "nc-large" },
                { value: "custom", icon: "nc-more" }
              ],
              style: buttonSizeCSS("accept")
            },
            {
              id: "acceptButtonPaddingRL",
              label: t("Width"),
              type: "slider",
              disabled: paddingDisabled,
              config: {
                min: 0,
                max: 100,
                units: [{ title: "px", value: "px" }]
              },
              style: buttonPaddingRLCSS("accept")
            },
            {
              id: "acceptButtonPaddingTB",
              label: t("Height"),
              type: "slider",
              disabled: paddingDisabled,
              config: {
                min: 0,
                max: 100,
                units: [{ title: "px", value: "px" }]
              },
              style: buttonPaddingTBCSS("accept")
            }
          ]
        }
      ]
    },
    {
      id: "acceptButtonTypographyPopover",
      type: "popover",
      config: {
        icon: "nc-font",
        size: device === "desktop" ? "large" : "auto",
        title: t("Typography")
      },
      position: 70,
      options: [
        {
          id: "acceptButtonTypography",
          type: "typography",
          config: {
            fontFamily: device === "desktop"
          },
          devices: "all",
          selector
        }
      ]
    },
    {
      id: "acceptButtonColors",
      type: "popover",
      config: {
        size: "medium",
        title: t("Colors"),
        icon: {
          style: {
            backgroundColor: bgColorSwatch
          }
        }
      },
      position: 80,
      options: [
        {
          id: "acceptButtonColorTabs",
          type: "tabs",
          tabs: [
            {
              id: "acceptButtonTabBg",
              label: t("Bg"),
              options: [
                {
                  id: "acceptButtonBgColor",
                  type: "colorPicker",
                  states: [NORMAL, HOVER],
                  style: buttonBgColorCSS(config, "accept")
                }
              ]
            },
            {
              id: "acceptButtonTabText",
              label: t("Text"),
              options: [
                {
                  id: "acceptButtonColor",
                  type: "colorPicker",
                  states: [NORMAL, HOVER],
                  style: buttonTextColorCSS(config, "accept")
                }
              ]
            },
            {
              id: "acceptButtonTabBorder",
              label: t("Border"),
              options: [
                {
                  id: "acceptButtonBorder",
                  type: "border",
                  states: [NORMAL, HOVER],
                  selector
                }
              ]
            },
            {
              id: "acceptButtonTabShadow",
              label: t("Shadow"),
              options: [
                {
                  id: "acceptButtonBoxShadow",
                  type: "boxShadow",
                  states: [NORMAL, HOVER],
                  selector
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
      position: 110,
      title: t("Settings")
    }
  ];
};
