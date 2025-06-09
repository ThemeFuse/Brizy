import type { GetItems } from "visual/editorComponents/EditorComponent/types";
import { getColorToolbar } from "visual/utils/color";
import { t } from "visual/utils/i18n";
import { defaultValueValue } from "visual/utils/onChange";
import { HOVER, NORMAL } from "visual/utils/stateMode";
import { inputsHeightCSS } from "./css";
import { inputsSelector } from "./css/selectors";
import type { Value } from "./types/Value";

export const getItems: GetItems<Value> = ({ v, device, state }) => {
  const dvv = (key: string) => defaultValueValue({ v, key, device, state });

  const inputsColor = getColorToolbar(
    dvv("inputsColorPalette"),
    dvv("inputsColorHex"),
    dvv("inputsColorOpacity")
  );

  return [
    {
      id: "toolbarTypographyInputs",
      type: "popover",
      config: {
        icon: "nc-font",
        size: device === "desktop" ? "large" : "auto",
        title: t("Typography")
      },
      position: 10,
      options: [
        {
          id: "inputsTypography",
          type: "typography",
          config: {
            fontFamily: device === "desktop"
          },
          selector: inputsSelector
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
            backgroundColor: inputsColor
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
              label: t("Color"),
              options: [
                {
                  id: "inputsColor",
                  type: "colorPicker",
                  states: [NORMAL, HOVER],
                  selector: inputsSelector
                }
              ]
            },
            {
              id: "tabBgColor",
              label: t("Bg"),
              options: [
                {
                  id: "inputsBgColor",
                  type: "backgroundColor",
                  states: [NORMAL, HOVER],
                  selector: inputsSelector
                }
              ]
            },
            {
              id: "tabBorder",
              label: t("Border"),
              options: [
                {
                  id: "inputsBorder",
                  type: "border",
                  states: [NORMAL, HOVER],
                  selector: inputsSelector
                }
              ]
            },
            {
              id: "tabShadow",
              label: t("Shadow"),
              options: [
                {
                  id: "inputsBoxShadow",
                  type: "boxShadow",
                  states: [NORMAL, HOVER],
                  selector: inputsSelector
                }
              ]
            }
          ]
        }
      ]
    },
    {
      id: "toolbarSettings",
      type: "popover",
      config: { icon: "nc-cog", title: t("Settings") },
      devices: "desktop",
      position: 40,
      options: [
        {
          id: "inputsHeight",
          label: t("Height"),
          type: "slider",
          config: {
            min: 0,
            max: 100,
            units: [{ value: "px", title: "px" }]
          },
          style: inputsHeightCSS
        },
        {
          id: "grid",
          type: "grid",
          config: {
            separator: true
          },
          columns: [
            {
              id: "col-1",
              options: [
                {
                  id: "styles",
                  type: "sidebarTabsButton",
                  config: {
                    tabId: "styles",
                    text: t("Styling"),
                    icon: "nc-cog",
                    align: "left"
                  }
                }
              ]
            }
          ]
        }
      ]
    }
  ];
};
