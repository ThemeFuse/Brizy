import { getColorToolbar } from "visual/utils/color";
import { t } from "visual/utils/i18n";
import { defaultValueValue } from "visual/utils/onChange";
import { HOVER, NORMAL } from "visual/utils/stateMode";
import type { GetItems } from "../../EditorComponent/types";
import {
  emptyMessageContainerSelector,
  emptyMessageSelector,
  getFlexAlignCSSFn,
  getWidthCSSFn
} from "../css";
import type { Value } from "../types";

export const getItems: GetItems<Value> = ({ v, device }) => {
  const dvv = (key: string) => defaultValueValue({ v, key, device });

  const emptyMessageColor = getColorToolbar(
    dvv("emptyMessageBgColorPalette"),
    dvv("emptyMessageBgColorHex"),
    dvv("emptyMessageBgColorOpacity")
  );

  return [
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
              id: "tabBackground",
              label: t("Background"),
              options: [
                {
                  id: "emptyMessage",
                  type: "backgroundColor",
                  states: [NORMAL, HOVER],
                  selector: emptyMessageSelector
                }
              ]
            },
            {
              id: "tabBorder",
              label: t("Border"),
              options: [
                {
                  id: "emptyMessageBorder",
                  type: "border",
                  states: [NORMAL, HOVER],
                  selector: emptyMessageSelector
                }
              ]
            },
            {
              id: "tabBoxShadow",
              label: t("Shadow"),
              options: [
                {
                  id: "emptyMessageBoxShadow",
                  type: "boxShadow",
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
      id: "emptyMessageContainerHorizontalAlign",
      type: "toggle",
      position: 100,
      choices: [
        { icon: "nc-text-align-left", title: t("Align"), value: "left" },
        { icon: "nc-text-align-center", title: t("Align"), value: "center" },
        { icon: "nc-text-align-right", title: t("Align"), value: "right" }
      ],
      style: getFlexAlignCSSFn(emptyMessageContainerSelector)
    },
    {
      id: "toolbarSettings",
      type: "popover",
      config: {
        icon: "nc-cog",
        title: t("Settings")
      },
      position: 110,
      options: [
        {
          id: "emptyMessageWidth",
          label: t("Width"),
          type: "slider",
          config: {
            min: 1,
            max: dvv("emptyMessageWidthSuffix") === "px" ? 1000 : 100,
            units: [
              { value: "%", title: "%" },
              { value: "px", title: "px" }
            ]
          },
          style: getWidthCSSFn(emptyMessageSelector)
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
