import { getColorToolbar } from "visual/utils/color";
import { t } from "visual/utils/i18n";
import { defaultValueValue } from "visual/utils/onChange";
import { HOVER, NORMAL } from "visual/utils/stateMode";
import type { GetItems } from "../../EditorComponent/types";
import {
  errorMessageSelector,
  getTextAlignCSSFn,
  invalidEmailMessageSelector,
  invalidMessageSelector
} from "../css";
import type { Value } from "../types";

export const getItems: GetItems<Value> = ({ v, device }) => {
  const dvv = (key: string) => defaultValueValue({ v, key, device });

  const errorMessageColor = getColorToolbar(
    dvv("errorMessageColorPalette"),
    dvv("errorMessageColorHex"),
    dvv("errorMessageColorOpacity")
  );

  const errorsSelector = `${errorMessageSelector}, ${invalidMessageSelector}, ${invalidEmailMessageSelector}`;

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
          id: "errorMessageTypography",
          type: "typography",
          config: {
            fontFamily: "desktop" === device
          },
          selector: errorsSelector
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
            backgroundColor: errorMessageColor
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
                  id: "errorMessageColor",
                  type: "colorPicker",
                  states: [NORMAL, HOVER],
                  selector: errorsSelector
                }
              ]
            },
            {
              id: "tabTextShadow",
              label: t("Shadow"),
              options: [
                {
                  id: "errorMessageTextShadow",
                  type: "textShadow",
                  states: [NORMAL, HOVER],
                  selector: errorsSelector
                }
              ]
            }
          ]
        }
      ]
    },
    {
      id: "errorMessageHorizontalAlign",
      type: "toggle",
      position: 100,
      choices: [
        { icon: "nc-text-align-left", title: t("Align"), value: "left" },
        { icon: "nc-text-align-center", title: t("Align"), value: "center" },
        { icon: "nc-text-align-right", title: t("Align"), value: "right" }
      ],
      style: getTextAlignCSSFn(errorsSelector)
    }
  ];
};
