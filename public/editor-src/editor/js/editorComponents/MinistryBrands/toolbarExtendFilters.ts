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

  const { hex: filterBgColorHex } = getOptionColorHexByPalette(
    dvv("filterBgColorHex"),
    dvv("filterBgColorPalette")
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
          id: "filterTypography",
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
      devices: "desktop",
      config: {
        title: t("Colors"),
        size: "medium",
        icon: {
          style: {
            backgroundColor: hexToRgba(
              filterBgColorHex,
              dvv("filterBgColorOpacity")
            )
          }
        }
      },
      position: 80,
      options: [
        {
          id: "tabsColor",
          type: "tabs",
          tabs: [
            {
              id: "tabFilterBg",
              label: t("Bg"),
              options: [
                {
                  id: "filter",
                  type: "backgroundColor",
                  states: [NORMAL, HOVER]
                }
              ]
            },
            {
              id: "tabInputBg",
              label: t("Input"),
              options: [
                {
                  id: "input",
                  type: "backgroundColor",
                  states: [NORMAL, HOVER]
                }
              ]
            },
            {
              id: "tabInputColor",
              label: t("Text"),
              options: [
                {
                  id: "input",
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
                  id: "inputBorder",
                  type: "border",
                  states: [NORMAL, HOVER]
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
      devices: "desktop"
    }
  ];
};
