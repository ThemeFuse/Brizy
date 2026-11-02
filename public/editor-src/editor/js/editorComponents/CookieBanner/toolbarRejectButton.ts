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
  const selector = buttonSelector("reject");
  const paddingDisabled = dvv("rejectButtonSize") !== "custom";

  const bgColorSwatch = getColorToolbar(
    dvv("rejectButtonBgColorPalette"),
    dvv("rejectButtonBgColorHex"),
    dvv("rejectButtonBgColorOpacity")
  );

  return [
    {
      id: "rejectButtonSizePopover",
      type: "popover",
      config: {
        icon: "nc-button",
        title: t("Button")
      },
      position: 60,
      options: [
        {
          id: "rejectButtonSizeGroup",
          type: "group",
          options: [
            {
              id: "rejectButtonSize",
              label: t("Size"),
              type: "radioGroup",
              choices: [
                { value: "small", icon: "nc-small" },
                { value: "medium", icon: "nc-medium" },
                { value: "large", icon: "nc-large" },
                { value: "custom", icon: "nc-more" }
              ],
              style: buttonSizeCSS("reject")
            },
            {
              id: "rejectButtonPaddingRL",
              label: t("Width"),
              type: "slider",
              disabled: paddingDisabled,
              config: {
                min: 0,
                max: 100,
                units: [{ title: "px", value: "px" }]
              },
              style: buttonPaddingRLCSS("reject")
            },
            {
              id: "rejectButtonPaddingTB",
              label: t("Height"),
              type: "slider",
              disabled: paddingDisabled,
              config: {
                min: 0,
                max: 100,
                units: [{ title: "px", value: "px" }]
              },
              style: buttonPaddingTBCSS("reject")
            }
          ]
        }
      ]
    },
    {
      id: "rejectButtonTypographyPopover",
      type: "popover",
      config: {
        icon: "nc-font",
        size: device === "desktop" ? "large" : "auto",
        title: t("Typography")
      },
      position: 70,
      options: [
        {
          id: "rejectButtonTypography",
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
      id: "rejectButtonColors",
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
          id: "rejectButtonColorTabs",
          type: "tabs",
          tabs: [
            {
              id: "rejectButtonTabBg",
              label: t("Bg"),
              options: [
                {
                  id: "rejectButtonBgColor",
                  type: "colorPicker",
                  states: [NORMAL, HOVER],
                  style: buttonBgColorCSS(config, "reject")
                }
              ]
            },
            {
              id: "rejectButtonTabText",
              label: t("Text"),
              options: [
                {
                  id: "rejectButtonColor",
                  type: "colorPicker",
                  states: [NORMAL, HOVER],
                  style: buttonTextColorCSS(config, "reject")
                }
              ]
            },
            {
              id: "rejectButtonTabBorder",
              label: t("Border"),
              options: [
                {
                  id: "rejectButtonBorder",
                  type: "border",
                  states: [NORMAL, HOVER],
                  selector
                }
              ]
            },
            {
              id: "rejectButtonTabShadow",
              label: t("Shadow"),
              options: [
                {
                  id: "rejectButtonBoxShadow",
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
