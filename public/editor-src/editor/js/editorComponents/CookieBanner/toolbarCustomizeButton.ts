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
  const selector = buttonSelector("customize");
  const paddingDisabled = dvv("customizeButtonSize") !== "custom";

  const bgColorSwatch = getColorToolbar(
    dvv("customizeButtonBgColorPalette"),
    dvv("customizeButtonBgColorHex"),
    dvv("customizeButtonBgColorOpacity")
  );

  return [
    {
      id: "customizeButtonSizePopover",
      type: "popover",
      config: {
        icon: "nc-button",
        title: t("Button")
      },
      position: 60,
      options: [
        {
          id: "customizeButtonSizeGroup",
          type: "group",
          options: [
            {
              id: "customizeButtonSize",
              label: t("Size"),
              type: "radioGroup",
              choices: [
                { value: "small", icon: "nc-small" },
                { value: "medium", icon: "nc-medium" },
                { value: "large", icon: "nc-large" },
                { value: "custom", icon: "nc-more" }
              ],
              style: buttonSizeCSS("customize")
            },
            {
              id: "customizeButtonPaddingRL",
              label: t("Width"),
              type: "slider",
              disabled: paddingDisabled,
              config: {
                min: 0,
                max: 100,
                units: [{ title: "px", value: "px" }]
              },
              style: buttonPaddingRLCSS("customize")
            },
            {
              id: "customizeButtonPaddingTB",
              label: t("Height"),
              type: "slider",
              disabled: paddingDisabled,
              config: {
                min: 0,
                max: 100,
                units: [{ title: "px", value: "px" }]
              },
              style: buttonPaddingTBCSS("customize")
            }
          ]
        }
      ]
    },
    {
      id: "customizeButtonTypographyPopover",
      type: "popover",
      config: {
        icon: "nc-font",
        size: device === "desktop" ? "large" : "auto",
        title: t("Typography")
      },
      position: 70,
      options: [
        {
          id: "customizeButtonTypography",
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
      id: "customizeButtonColors",
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
          id: "customizeButtonColorTabs",
          type: "tabs",
          tabs: [
            {
              id: "customizeButtonTabBg",
              label: t("Bg"),
              options: [
                {
                  id: "customizeButtonBgColor",
                  type: "colorPicker",
                  states: [NORMAL, HOVER],
                  style: buttonBgColorCSS(config, "customize")
                }
              ]
            },
            {
              id: "customizeButtonTabText",
              label: t("Text"),
              options: [
                {
                  id: "customizeButtonColor",
                  type: "colorPicker",
                  states: [NORMAL, HOVER],
                  style: buttonTextColorCSS(config, "customize")
                }
              ]
            },
            {
              id: "customizeButtonTabBorder",
              label: t("Border"),
              options: [
                {
                  id: "customizeButtonBorder",
                  type: "border",
                  states: [NORMAL, HOVER],
                  selector
                }
              ]
            },
            {
              id: "customizeButtonTabShadow",
              label: t("Shadow"),
              options: [
                {
                  id: "customizeButtonBoxShadow",
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
