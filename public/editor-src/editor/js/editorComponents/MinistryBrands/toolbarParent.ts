import { ElementModel } from "visual/component/Elements/Types";
import { hexToRgba } from "visual/utils/color";
import { t } from "visual/utils/i18n";
import { defaultValueValue } from "visual/utils/onChange";
import { getOptionColorHexByPalette } from "visual/utils/options";
import { HOVER, NORMAL } from "visual/utils/stateMode";
import { ToolbarItemType } from "../ToolbarItemType";
import { Params } from "../EditorComponent/types";

export const toolbarParentColors = <
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

  const { hex: parentBgColorHex } = getOptionColorHexByPalette(
    dvv("parentBgColorHex"),
    dvv("parentBgColorPalette")
  );

  return [
    {
      id: "toolbarParentColors",
      type: "popover-dev",
      devices: "desktop",
      position: 70,
      config: {
        title: t("Colors"),
        size: "auto",
        icon: {
          style: {
            backgroundColor: hexToRgba(
              parentBgColorHex,
              dvv("parentBgColorOpacity")
            )
          }
        }
      },
      options: [
        {
          id: "tabsColor",
          type: "tabs-dev",
          tabs: [
            {
              id: "tabParentBg",
              label: t("Background"),
              options: [
                {
                  id: "parent",
                  type: "backgroundColor-dev",
                  states: [NORMAL, HOVER]
                }
              ]
            },
            {
              id: "tabParentBorder",
              label: t("Border"),
              options: [
                {
                  id: "parentBorder",
                  type: "border-dev",
                  states: [NORMAL, HOVER]
                }
              ]
            },
            {
              id: "tabParentBoxShadow",
              label: t("Shadow"),
              options: [
                {
                  id: "parentBoxShadow",
                  type: "boxShadow-dev",
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
