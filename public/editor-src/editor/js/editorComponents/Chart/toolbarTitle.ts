import { noop } from "es-toolkit";
import { GetItems } from "visual/editorComponents/EditorComponent/types";
import { t } from "visual/utils/i18n";
import { HOVER, NORMAL } from "visual/utils/stateMode";
import { titleAlignCSS } from "./css";
import { Props, Value } from "./types";

export const getItems: GetItems<Value, Props> = ({ device }) => {
  return [
    {
      id: "toolbarColor",
      type: "popover",
      config: {
        size: "auto",
        title: t("Colors"),
        icon: {
          style: {
            backgroundColor: "#0000"
          }
        }
      },
      devices: "desktop",
      position: 90,
      options: [
        {
          id: "tabsColor",
          type: "tabs",
          tabs: [
            {
              id: "tabTitle",
              label: t("Title"),
              options: [
                {
                  id: "titleColor",
                  type: "colorPicker",
                  states: [NORMAL, HOVER],
                  selector: "{{WRAPPER}} .brz-chart_title"
                }
              ]
            },
            {
              id: "tabShadow",
              label: t("Shadow"),
              options: [
                {
                  id: "titleTextShadow",
                  type: "textShadow",
                  states: [NORMAL, HOVER],
                  selector: "{{WRAPPER}} .brz-chart_title"
                }
              ]
            }
          ]
        }
      ]
    },
    {
      id: "toolbarTypography",
      type: "popover",
      config: {
        icon: "nc-font",
        size: "auto",
        title: t("Typography")
      },
      position: 70,
      options: [
        {
          id: "gridTypography",
          type: "grid",
          columns: [
            {
              id: "",
              size: 1,
              align: "center",
              options: [
                {
                  id: "",
                  type: "typography",
                  config: {
                    fontFamily: device === "desktop"
                  },
                  selector: "{{WRAPPER}} .brz-chart_title"
                }
              ]
            }
          ]
        }
      ]
    },
    {
      id: "titleHorizontalAlign",
      type: "toggle",
      choices: [
        { icon: "nc-text-align-left", title: t("Align"), value: "left" },
        { icon: "nc-text-align-center", title: t("Align"), value: "center" },
        { icon: "nc-text-align-right", title: t("Align"), value: "right" }
      ],
      style: titleAlignCSS
    },
    { id: "remove", type: "button", disabled: true, onClick: noop },
    {
      id: "horizontalAlign",
      type: "toggle",
      disabled: true,
      onClick: noop,
      choices: []
    },
    { id: "duplicate", type: "button", disabled: true, onClick: noop }
  ];
};
