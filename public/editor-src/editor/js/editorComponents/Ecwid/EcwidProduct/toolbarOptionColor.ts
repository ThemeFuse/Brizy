import type { GetItems } from "visual/editorComponents/EditorComponent/types";
import { getColorToolbar } from "visual/utils/color";
import { t } from "visual/utils/i18n";
import { defaultValueValue } from "visual/utils/onChange";
import { HOVER, NORMAL } from "visual/utils/stateMode";
import {
  optionColorAlignCSS,
  optionColorSelectedItemSelector,
  optionColorSpacingCSS,
  optionColorTooltipSelector
} from "./css";
import { Value } from "./types/Value";

export const getItems: GetItems<Value> = ({ v, device, state }) => {
  const dvv = (key: string) => defaultValueValue({ v, key, device, state });

  const optionColorColor = getColorToolbar(
    dvv("optionColorColorPalette"),
    dvv("optionColorColorHex"),
    dvv("optionColorColorOpacity")
  );

  return [
    {
      id: "toolbarTypography",
      type: "popover",
      config: {
        icon: "nc-font",
        size: device === "desktop" ? "large" : "auto",
        title: t("Typography")
      },
      position: 10,
      options: [
        {
          id: "optionColorTypography",
          type: "typography",
          config: { fontFamily: device === "desktop" },
          selector: optionColorTooltipSelector
        }
      ]
    },
    {
      id: "toolbarColor",
      type: "popover",
      config: {
        size: "auto",
        title: t("Colors"),
        icon: {
          style: {
            backgroundColor: optionColorColor
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
              id: "tabTooltip",
              label: t("Tooltip"),
              options: [
                {
                  id: "optionColorColor",
                  type: "colorPicker",
                  selector: `${optionColorTooltipSelector} .ui-tooltip__text`
                }
              ]
            },
            {
              id: "tabTooltipBg",
              label: t("Tooltip Bg."),
              options: [
                {
                  id: "optionColor",
                  type: "backgroundColor",
                  selector: optionColorTooltipSelector
                }
              ]
            },
            {
              id: "tabBorder",
              label: t("Border"),
              options: [
                {
                  id: "optionColorBorder",
                  type: "border",
                  selector: `${optionColorSelectedItemSelector} .options-swatches-item__color--selected`
                }
              ]
            },
            {
              id: "tabBoxShadow",
              label: t("Shadow"),
              options: [
                {
                  id: "optionColorBoxShadow",
                  type: "boxShadow",
                  states: [NORMAL, HOVER],
                  selector: optionColorSelectedItemSelector
                }
              ]
            }
          ]
        }
      ]
    },
    {
      id: "optionColorHorizontalAlign",
      type: "toggle",
      position: 30,
      choices: [
        { icon: "nc-text-align-left", title: t("Align"), value: "left" },
        { icon: "nc-text-align-center", title: t("Align"), value: "center" },
        { icon: "nc-text-align-right", title: t("Align"), value: "right" }
      ],
      style: optionColorAlignCSS
    },
    {
      id: "toolbarSettings",
      type: "popover",
      config: { icon: "nc-cog", title: t("Settings") },
      devices: "desktop",
      position: 40,
      options: [
        {
          id: "optionColorSpacing",
          label: t("Spacing"),
          type: "slider",
          config: {
            min: 0,
            max: 100,
            units: [{ value: "px", title: "px" }]
          },
          style: optionColorSpacingCSS
        },
        {
          id: "styles",
          type: "sidebarTabsButton",
          devices: "desktop",
          config: {
            tabId: "styles",
            text: t("Styling"),
            icon: "nc-cog",
            align: "left"
          }
        }
      ]
    }
  ];
};
