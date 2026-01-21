import { getColorToolbar } from "visual/utils/color";
import { t } from "visual/utils/i18n";
import { defaultValueValue } from "visual/utils/onChange";
import { HOVER, NORMAL } from "visual/utils/stateMode";
import type { GetItems } from "../../EditorComponent/types";
import { getTextAlignCSSFn, successMessageSelector } from "../css";
import type { Value } from "../types";

export const getItems: GetItems<Value> = ({ v, device }) => {
  const dvv = (key: string) => defaultValueValue({ v, key, device });

  const successMessageColor = getColorToolbar(
    dvv("successMessageColorPalette"),
    dvv("successMessageColorHex"),
    dvv("successMessageColorOpacity")
  );

  return [
    {
      id: "toolbarTypography",
      type: "popover",
      config: {
        icon: "nc-font",
        size: device === "desktop" ? "xlarge" : "auto",
        title: t("Typography")
      },
      position: 70,
      options: [
        {
          id: "successMessageTypography",
          type: "typography",
          config: {
            fontFamily: "desktop" === device
          },
          selector: successMessageSelector
        }
      ]
    },
    {
      id: "toolbarColor",
      type: "popover",
      devices: "desktop",
      config: {
        size: "medium",
        title: t("Colors"),
        icon: {
          style: {
            backgroundColor: successMessageColor
          }
        }
      },
      position: 90,
      options: [
        {
          id: "tabsColor",
          type: "tabs",
          tabs: [
            {
              id: "tabTitle",
              label: t("Text"),
              options: [
                {
                  id: "successMessageColor",
                  type: "colorPicker",
                  states: [NORMAL, HOVER],
                  selector: successMessageSelector
                }
              ]
            },
            {
              id: "tabBoxShadow",
              label: t("Shadow"),
              options: [
                {
                  id: "successMessageTextShadow",
                  type: "textShadow",
                  states: [NORMAL, HOVER],
                  selector: successMessageSelector
                }
              ]
            }
          ]
        }
      ]
    },
    {
      id: "successMessageHorizontalAlign",
      type: "toggle",
      position: 100,
      choices: [
        { icon: "nc-text-align-left", title: t("Align"), value: "left" },
        { icon: "nc-text-align-center", title: t("Align"), value: "center" },
        { icon: "nc-text-align-right", title: t("Align"), value: "right" }
      ],
      style: getTextAlignCSSFn(successMessageSelector)
    }
  ];
};
