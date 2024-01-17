import { ElementModel } from "visual/component/Elements/Types";
import { hexToRgba } from "visual/utils/color";
import { t } from "visual/utils/i18n";
import { defaultValueValue } from "visual/utils/onChange";
import { getOptionColorHexByPalette } from "visual/utils/options";
import { HOVER, NORMAL } from "visual/utils/stateMode";
import { Params } from "../EditorComponent/types";
import { ToolbarItemType } from "../ToolbarItemType";

export const getItems = <
  M extends ElementModel,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  P extends Record<string, any> = Record<string, unknown>,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  S extends Record<string, any> = Record<string, unknown>
>({
  v,
  device
}: Params<M, P, S>): ToolbarItemType[] => {
  const dvv = (key: string): unknown => defaultValueValue({ v, key, device });

  const { hex: detailButtonBgColorHex } = getOptionColorHexByPalette(
    dvv("detailButtonBgColorHex"),
    dvv("detailButtonBgColorPalette")
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
      position: 70,
      options: [
        {
          id: "detailButtonTypography",
          type: "typography",
          config: {
            fontFamily: device === "desktop"
          }
        }
      ]
    },
    {
      id: "toolbarColor",
      type: "popover",
      config: {
        title: t("Colors"),
        size: "medium",
        icon: {
          style: {
            backgroundColor: hexToRgba(
              detailButtonBgColorHex,
              dvv("detailButtonBgColorOpacity")
            )
          }
        }
      },
      devices: "desktop",
      position: 80,
      options: [
        {
          id: "tabsColor",
          type: "tabs",
          tabs: [
            {
              id: "tabBgColor",
              label: t("Bg"),
              options: [
                {
                  id: "detailButton",
                  type: "backgroundColor",
                  states: [NORMAL, HOVER]
                }
              ]
            },
            {
              id: "tabColor",
              label: t("Text"),
              options: [
                {
                  id: "detailButtonColor",
                  type: "colorPicker",
                  states: [NORMAL, HOVER]
                }
              ]
            },

            {
              id: "tabBorder",
              label: t("Border"),
              options: [
                {
                  id: "detailButtonBorder",
                  type: "border",
                  states: [NORMAL, HOVER]
                }
              ]
            },

            {
              id: "tabShadow",
              label: t("Shadow"),
              options: [
                {
                  id: "detailButtonBoxShadow",
                  type: "boxShadow",
                  states: [NORMAL, HOVER]
                }
              ]
            }
          ]
        }
      ]
    }
  ];
};
