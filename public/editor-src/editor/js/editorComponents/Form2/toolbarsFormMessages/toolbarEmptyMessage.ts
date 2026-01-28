import { getColorToolbar } from "visual/utils/color";
import { t } from "visual/utils/i18n";
import { defaultValueValue } from "visual/utils/onChange";
import { HOVER, NORMAL } from "visual/utils/stateMode";
import type { GetItems } from "../../EditorComponent/types";
import { emptyMessageSelector, getTextAlignCSSFn } from "../css";
import type { Value } from "../types";

export const getItems: GetItems<Value> = ({ v, device }) => {
  const dvv = (key: string) => defaultValueValue({ v, key, device });

  const emptyMessageColor = getColorToolbar(
    dvv("emptyMessageColorPalette"),
    dvv("emptyMessageColorHex"),
    dvv("emptyMessageColorOpacity")
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
          id: "emptyMessageTypography",
          type: "typography",
          config: {
            fontFamily: "desktop" === device
          },
          selector: emptyMessageSelector
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
            backgroundColor: emptyMessageColor
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
              id: "tabText",
              label: t("Text"),
              options: [
                {
                  id: "emptyMessageColor",
                  type: "colorPicker",
                  states: [NORMAL, HOVER],
                  selector: emptyMessageSelector
                }
              ]
            },
            {
              id: "tabTextShadow",
              label: t("Shadow"),
              options: [
                {
                  id: "emptyMessageTextShadow",
                  type: "textShadow",
                  states: [NORMAL, HOVER],
                  selector: emptyMessageSelector
                }
              ]
            }
          ]
        }
      ]
    },
    {
      id: "emptyMessageHorizontalAlign",
      type: "toggle",
      position: 100,
      choices: [
        { icon: "nc-text-align-left", title: t("Align"), value: "left" },
        { icon: "nc-text-align-center", title: t("Align"), value: "center" },
        { icon: "nc-text-align-right", title: t("Align"), value: "right" }
      ],
      style: getTextAlignCSSFn(emptyMessageSelector)
    }
  ];
};
