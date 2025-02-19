import { ElementModel } from "visual/component/Elements/Types";
import { Props as TabProps } from "visual/component/Options/types/dev/Tabs/index";
import { getColorToolbar } from "visual/utils/color";
import { t } from "visual/utils/i18n";
import { defaultValueValue } from "visual/utils/onChange";
import { HOVER, NORMAL } from "visual/utils/stateMode";
import { Params } from "../EditorComponent/types";
import { ToolbarItemType } from "../ToolbarItemType";

export const toolbarParentColors = <
  M extends ElementModel,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  P extends Record<string, any> = Record<string, unknown>,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  S extends Record<string, any> = Record<string, unknown>
>(
  data: Params<M, P, S>,
  additionalOptions?: TabProps["tabs"]
): ToolbarItemType[] => {
  const { v, device } = data;
  const dvv = (key: string) => defaultValueValue({ v, key, device });

  const parentBgColor = getColorToolbar(
    dvv("parentBgColorPalette"),
    dvv("parentBgColorHex"),
    dvv("parentBgColorOpacity")
  );

  return [
    {
      id: "toolbarParentColors",
      type: "popover",
      devices: "desktop",
      position: 70,
      config: {
        title: t("Colors"),
        size: "medium",
        icon: {
          style: {
            backgroundColor: parentBgColor
          }
        }
      },
      options: [
        {
          id: "tabsColor",
          type: "tabs",
          tabs: [
            {
              id: "tabParentBg",
              label: t("Background"),
              options: [
                {
                  id: "parent",
                  type: "backgroundColor",
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
                  type: "border",
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
                  type: "boxShadow",
                  states: [NORMAL, HOVER]
                }
              ]
            },
            ...(additionalOptions ?? [])
          ]
        }
      ]
    }
  ];
};
