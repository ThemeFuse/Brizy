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
  buttonTextColorCSS,
  dialogButtonsAlignCSS
} from "./css";
import type { Props, Value } from "./types";

export const getItems: GetItems<Value, Props> = ({ v, device, component }) => {
  const dvv = (key: string) => defaultValueValue({ v, key, device });
  const config = component.getGlobalConfig();
  const selector = buttonSelector("save");
  const paddingDisabled = dvv("saveButtonSize") !== "custom";

  const bgColorSwatch = getColorToolbar(
    dvv("saveButtonBgColorPalette"),
    dvv("saveButtonBgColorHex"),
    dvv("saveButtonBgColorOpacity")
  );

  return [
    {
      id: "saveButtonSizePopover",
      type: "popover",
      config: {
        icon: "nc-button",
        title: t("Button")
      },
      position: 60,
      options: [
        {
          id: "saveButtonSizeGroup",
          type: "group",
          options: [
            {
              id: "saveButtonSize",
              label: t("Size"),
              type: "radioGroup",
              choices: [
                { value: "small", icon: "nc-small" },
                { value: "medium", icon: "nc-medium" },
                { value: "large", icon: "nc-large" },
                { value: "custom", icon: "nc-more" }
              ],
              style: buttonSizeCSS("save")
            },
            {
              id: "saveButtonPaddingRL",
              label: t("Width"),
              type: "slider",
              disabled: paddingDisabled,
              config: {
                min: 0,
                max: 100,
                units: [{ title: "px", value: "px" }]
              },
              style: buttonPaddingRLCSS("save")
            },
            {
              id: "saveButtonPaddingTB",
              label: t("Height"),
              type: "slider",
              disabled: paddingDisabled,
              config: {
                min: 0,
                max: 100,
                units: [{ title: "px", value: "px" }]
              },
              style: buttonPaddingTBCSS("save")
            }
          ]
        }
      ]
    },
    {
      id: "saveButtonTypographyPopover",
      type: "popover",
      config: {
        icon: "nc-font",
        size: device === "desktop" ? "large" : "auto",
        title: t("Typography")
      },
      position: 70,
      options: [
        {
          id: "saveButtonTypography",
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
      id: "saveButtonColors",
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
          id: "saveButtonColorTabs",
          type: "tabs",
          tabs: [
            {
              id: "saveButtonTabBg",
              label: t("Bg"),
              options: [
                {
                  id: "saveButtonBgColor",
                  type: "colorPicker",
                  states: [NORMAL, HOVER],
                  style: buttonBgColorCSS(config, "save")
                }
              ]
            },
            {
              id: "saveButtonTabText",
              label: t("Text"),
              options: [
                {
                  id: "saveButtonColor",
                  type: "colorPicker",
                  states: [NORMAL, HOVER],
                  style: buttonTextColorCSS(config, "save")
                }
              ]
            },
            {
              id: "saveButtonTabBorder",
              label: t("Border"),
              options: [
                {
                  id: "saveButtonBorder",
                  type: "border",
                  states: [NORMAL, HOVER],
                  selector
                }
              ]
            },
            {
              id: "saveButtonTabShadow",
              label: t("Shadow"),
              options: [
                {
                  id: "saveButtonBoxShadow",
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
    // The only option the 2 dialog buttons share: `dialogButtonsAlign` is
    // declared with the same key in `toolbarDialogAcceptButton.ts`, so it moves
    // both of them (it lays out their common footer) no matter which one is
    // selected.
    {
      id: "dialogButtonsAlign",
      type: "toggle",
      position: 90,
      choices: [
        { icon: "nc-text-align-left", title: t("Align"), value: "left" },
        { icon: "nc-text-align-center", title: t("Align"), value: "center" },
        { icon: "nc-text-align-right", title: t("Align"), value: "right" }
      ],
      style: dialogButtonsAlignCSS
    },
    {
      id: "advancedSettings",
      type: "advancedSettings",
      position: 110,
      title: t("Settings")
    }
  ];
};
