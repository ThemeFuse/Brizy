import type { ElementModel } from "visual/component/Elements/Types";
import type { Params } from "visual/editorComponents/EditorComponent/types";
import type { ToolbarItemType } from "visual/editorComponents/ToolbarItemType";
import { getColorToolbar } from "visual/utils/color";
import { t } from "visual/utils/i18n";
import { defaultValueValue } from "visual/utils/onChange";
import { HOVER, NORMAL } from "visual/utils/stateMode";

export const getItems = <
  M extends ElementModel,
  // biome-ignore lint/suspicious/noExplicitAny: migrated from eslint
  P extends Record<string, any> = Record<string, unknown>,
  // biome-ignore lint/suspicious/noExplicitAny: migrated from eslint
  S extends Record<string, any> = Record<string, unknown>
>({
  v,
  device
}: Params<M, P, S>): ToolbarItemType[] => {
  const dvv = (key: string) => defaultValueValue({ v, key, device });

  const metaLinksColor = getColorToolbar(
    dvv("socialBgColorPalette"),
    dvv("socialBgColorHex"),
    dvv("socialBgColorOpacity")
  );

  return [
    {
      id: "toolbarColor",
      type: "popover",
      config: {
        title: t("Colors"),
        size: "medium",
        icon: {
          style: {
            backgroundColor: metaLinksColor
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
              id: "tabColor",
              label: t("Icon"),
              options: [
                {
                  id: "socialColor",
                  type: "colorPicker",
                  states: [NORMAL, HOVER]
                }
              ]
            },
            {
              id: "tabBgColor",
              label: t("Bg"),
              options: [
                {
                  id: "social",
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
                  id: "socialBorder",
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
                  id: "socialBoxShadow",
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
