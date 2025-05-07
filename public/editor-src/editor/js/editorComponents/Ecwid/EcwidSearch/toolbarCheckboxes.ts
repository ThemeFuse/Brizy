import { GetItems } from "visual/editorComponents/EditorComponent/types";
import { getColorToolbar } from "visual/utils/color";
import { t } from "visual/utils/i18n";
import { defaultValueValue } from "visual/utils/onChange";
import { ACTIVE, HOVER, NORMAL } from "visual/utils/stateMode";
import { formControlSelector } from "./css/selectors";
import { Value } from "./types";

export const getItems: GetItems<Value> = ({ v, device, state }) => {
  const dvv = (key: string) => defaultValueValue({ v, key, device, state });

  const checkboxesColor = getColorToolbar(
    dvv("checkboxesColorPalette"),
    dvv("checkboxesColorHex"),
    dvv("checkboxesColorOpacity")
  );

  return [
    {
      id: "toolbarTypographyCheckboxes",
      type: "popover",
      config: {
        icon: "nc-font",
        size: device === "desktop" ? "large" : "auto",
        title: t("Typography")
      },
      position: 10,
      options: [
        {
          id: "checkboxesTypography",
          type: "typography",
          config: {
            fontFamily: device === "desktop"
          },
          selector: `${formControlSelector}.form-control--checkbox .form-control__inline-label`
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
            backgroundColor: checkboxesColor
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
                  id: "checkboxesColor",
                  type: "colorPicker",
                  states: [NORMAL, HOVER],
                  selector: `${formControlSelector}.form-control--checkbox`
                }
              ]
            },
            {
              id: "tabBackground",
              label: t("Bg"),
              options: [
                {
                  id: "checkboxes",
                  type: "backgroundColor",
                  states: [NORMAL, HOVER, ACTIVE]
                }
              ]
            },
            {
              id: "tabBorder",
              label: t("Border"),
              options: [
                {
                  id: "checkboxesBorder",
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
                  id: "checkboxesTextShadow",
                  type: "textShadow",
                  states: [NORMAL, HOVER],
                  selector: `${formControlSelector}.form-control--checkbox`
                }
              ]
            },
            {
              id: "tabIconColor",
              label: t("Icon"),
              options: [
                {
                  id: "checkboxesIconColor",
                  type: "colorPicker",
                  states: [NORMAL, HOVER],
                  selector: `${formControlSelector}.form-control--checkbox .form-control__checkbox-view svg`
                }
              ]
            }
          ]
        }
      ]
    }
  ];
};
