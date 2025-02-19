import { GetItems } from "visual/editorComponents/EditorComponent/types";
import { getColorToolbar } from "visual/utils/color";
import { t } from "visual/utils/i18n";
import { defaultValueValue } from "visual/utils/onChange";
import { HOVER, NORMAL } from "visual/utils/stateMode";
import {
  addressInputsSelector,
  checkoutInputsPlaceholderLabelSelector,
  checkoutInputsSelector
} from "./css/selectors";
import { Value } from "./types/Value";

export const getItems: GetItems<Value> = ({ v, device, state }) => {
  const dvv = (key: string) => defaultValueValue({ v, key, device, state });

  const checkoutInputsColor = getColorToolbar(
    dvv("checkoutInputsColorPalette"),
    dvv("checkoutInputsColorHex"),
    dvv("checkoutInputsColorOpacity")
  );

  return [
    {
      id: "toolbarTypographyCheckoutFields",
      type: "popover",
      config: {
        icon: "nc-font",
        size: device === "desktop" ? "large" : "auto",
        title: t("Typography")
      },
      position: 10,
      options: [
        {
          id: "checkoutInputsTypography",
          type: "typography",
          config: { fontFamily: device === "desktop" },
          selector: `${checkoutInputsSelector}, ${addressInputsSelector}`
        }
      ]
    },
    {
      id: "toolbarColorCheckoutInputs",
      type: "popover",
      config: {
        size: "medium",
        title: t("Colors"),
        icon: {
          style: {
            backgroundColor: checkoutInputsColor
          }
        }
      },
      devices: "desktop",
      position: 20,
      options: [
        {
          id: "colorsTab",
          type: "tabs",
          tabs: [
            {
              id: "tabColor",
              label: t("Color"),
              options: [
                {
                  id: "checkoutInputsColor",
                  type: "colorPicker",
                  states: [NORMAL, HOVER],
                  selector: `${checkoutInputsSelector}, ${addressInputsSelector}`
                }
              ]
            },
            {
              id: "tabPlaceholderColor",
              label: t("Placeholder"),
              options: [
                {
                  id: "checkoutInputsPlaceholderColor",
                  type: "colorPicker",
                  states: [NORMAL, HOVER],
                  selector: checkoutInputsPlaceholderLabelSelector
                }
              ]
            },
            {
              id: "tabBackground",
              label: t("Bg"),
              options: [
                {
                  id: "checkoutInputs",
                  type: "backgroundColor",
                  states: [NORMAL, HOVER],
                  selector: `${checkoutInputsSelector}, ${addressInputsSelector}`
                }
              ]
            },
            {
              id: "tabBorder",
              label: t("Border"),
              options: [
                {
                  id: "checkoutInputsBorder",
                  type: "border",
                  states: [NORMAL, HOVER],
                  selector: `${checkoutInputsSelector}, ${addressInputsSelector}`
                }
              ]
            },
            {
              id: "tabShadow",
              label: t("Shadow"),
              options: [
                {
                  id: "checkoutInputsBoxShadow",
                  type: "boxShadow",
                  states: [NORMAL, HOVER],
                  selector: `${checkoutInputsSelector}, ${addressInputsSelector}`
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
      devices: "desktop"
    }
  ];
};
