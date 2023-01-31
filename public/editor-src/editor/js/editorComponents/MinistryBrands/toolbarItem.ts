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

  const { hex: itemBgColorHex } = getOptionColorHexByPalette(
    dvv("itemBgColorHex"),
    dvv("itemBgColorPalette")
  );

  return [
    {
      id: "toolbarItem",
      type: "popover-dev",
      devices: "desktop",
      position: 70,
      config: {
        title: t("Colors"),
        size: "auto",
        icon: {
          style: {
            backgroundColor: hexToRgba(
              itemBgColorHex,
              dvv("itemBgColorOpacity")
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
              id: "tabItemBorder",
              label: t("Border"),
              options: [
                {
                  id: "itemBorder",
                  type: "border-dev",
                  states: [NORMAL, HOVER]
                }
              ]
            },
            {
              id: "tabItemBoxShadow",
              label: t("Shadow"),
              options: [
                {
                  id: "itemBoxShadow",
                  type: "boxShadow-dev",
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
      // @ts-expect-error advancedSettings is old option
      type: "advancedSettings"
    }
  ];
};
