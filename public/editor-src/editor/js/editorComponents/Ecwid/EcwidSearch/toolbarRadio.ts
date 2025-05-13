import { GetItems } from "visual/editorComponents/EditorComponent/types";
import { getColorToolbar } from "visual/utils/color";
import { t } from "visual/utils/i18n";
import { defaultValueValue } from "visual/utils/onChange";
import { ACTIVE, HOVER, NORMAL } from "visual/utils/stateMode";
import { formControlSelector } from "./css/selectors";
import { Value } from "./types";

export const getItems: GetItems<Value> = ({ v, device, state }) => {
  const dvv = (key: string) => defaultValueValue({ v, key, device, state });

  const radioColor = getColorToolbar(
    dvv("radioColorPalette"),
    dvv("radioColorHex"),
    dvv("radioColorOpacity")
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
          id: "radioTypography",
          type: "typography",
          config: {
            fontFamily: device === "desktop"
          },
          selector: `${formControlSelector}.form-control--radio .form-control__inline-label`
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
              id: "tabColor",
              label: t("Text"),
              options: [
                {
                  id: "radioColor",
                  type: "colorPicker",
                  states: [NORMAL, HOVER],
                  selector: `${formControlSelector}.form-control--radio`
                }
              ]
            },
            {
              id: "tabBackground",
              label: t("Bg"),
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
            },
            {
              id: "tabShadow",
              label: t("Shadow"),
              options: [
                {
                  id: "radioTextShadow",
                  type: "textShadow",
                  states: [NORMAL, HOVER],
                  selector: `${formControlSelector}.form-control--radio`
                }
              ]
            }
          ]
        }
      ]
    }
  ];
};
