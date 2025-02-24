import { noop } from "es-toolkit";
import { GetItems } from "visual/editorComponents/EditorComponent/types";
import { getColorToolbar } from "visual/utils/color";
import { t } from "visual/utils/i18n";
import { defaultValueValue } from "visual/utils/onChange";
import { HOVER, NORMAL } from "visual/utils/stateMode";
import { Value } from "./types/Value";

export const getItems: GetItems<Value> = ({ v, device, state }) => {
  const dvv = (key: string) => defaultValueValue({ v, key, device, state });

  const iconColor = getColorToolbar(
    dvv("iconColorPalette"),
    dvv("iconColorHex"),
    dvv("iconColorOpacity")
  );

  return [
    {
      id: "toolbarCurrentElementIcon",
      type: "popover",
      config: {
        title: t("Icon Styles"),
        icon: "nc-star"
      },
      position: 10,
      options: [
        {
          id: "iconPositionLeft",
          label: t("Lateral"),
          type: "slider",
          config: {
            min: -50,
            max: 50,
            units: [{ title: "px", value: "px" }]
          }
        },
        {
          id: "iconPositionTop",
          label: t("Vertical"),
          type: "slider",
          config: {
            min: -50,
            max: 50,
            units: [{ title: "px", value: "px" }]
          }
        },
        {
          id: "iconSpacing",
          label: t("Size"),
          type: "slider",
          config: {
            min: 1,
            max: 50,
            units: [{ title: "px", value: "px" }]
          }
        }
      ]
    },
    {
      id: "toolbarTypography",
      type: "popover",
      config: {
        icon: "nc-font",
        size: device === "desktop" ? "large" : "auto",
        title: t("Typography")
      },
      position: 20,
      options: [
        {
          id: "typography",
          type: "typography",
          config: {
            fontFamily: device === "desktop"
          }
        }
      ]
    },
    {
      id: "toolbarIconColor",
      type: "popover",
      config: {
        size: "auto",
        title: t("Colors"),
        icon: {
          style: {
            backgroundColor: iconColor
          }
        }
      },
      devices: "desktop",
      position: 30,
      options: [
        {
          id: "tabsColorIcon",
          type: "tabs",
          tabs: [
            {
              id: "tabColorIcon",
              label: t("Text"),
              options: [
                {
                  id: "iconColor",
                  type: "colorPicker",
                  states: [NORMAL, HOVER]
                }
              ]
            },
            {
              id: "tabBg",
              label: t("Bg"),
              options: [
                {
                  id: "icon",
                  type: "backgroundColor",
                  states: [NORMAL, HOVER]
                }
              ]
            },
            {
              id: "tabBorder",
              label: t("Border"),
              options: [
                {
                  id: "iconBorder",
                  type: "border",
                  states: [NORMAL, HOVER]
                }
              ]
            },
            {
              id: "tabBoxShadow",
              label: t("Shadow"),
              options: [
                {
                  id: "iconBoxShadow",
                  type: "boxShadow",
                  states: [NORMAL, HOVER]
                }
              ]
            }
          ]
        }
      ]
    },
    {
      id: "horizontalAlign",
      type: "toggle",
      disabled: true,
      choices: []
    },
    {
      id: "duplicate",
      type: "button",
      onClick: noop,
      disabled: true
    },
    {
      id: "remove",
      type: "button",
      onClick: noop,
      disabled: true
    },
    {
      id: "advancedSettings",
      type: "advancedSettings",
      position: 40,
      devices: "desktop",
      title: t("Settings")
    }
  ];
};
