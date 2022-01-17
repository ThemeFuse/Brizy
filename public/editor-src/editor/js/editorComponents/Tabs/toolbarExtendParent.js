import { t } from "visual/utils/i18n";
import { hexToRgba } from "visual/utils/color";
import { getOptionColorHexByPalette } from "visual/utils/options";
import { defaultValueValue } from "visual/utils/onChange";
import { HOVER, NORMAL } from "visual/utils/stateMode";

export function getItems({ v, device }) {
  const dvv = key => defaultValueValue({ key, v, device });

  const { hex: contentBgColorHex } = getOptionColorHexByPalette(
    dvv("contentBgColorHex"),
    dvv("contentBgColorPalette")
  );

  return [
    {
      id: "toolbarColor",
      type: "popover-dev",
      config: {
        size: "auto",
        title: t("Colors"),
        icon: {
          style: {
            backgroundColor: hexToRgba(
              contentBgColorHex,
              v.contentBgColorOpacity
            )
          }
        }
      },
      devices: "desktop",
      position: 90,
      options: [
        {
          id: "tabsColor",
          type: "tabs-dev",
          tabs: [
            {
              id: "contentBg",
              label: t("Bg"),
              options: [
                {
                  id: "contentBgColor",
                  type: "colorPicker-dev",
                  states: [NORMAL, HOVER]
                }
              ]
            },
            {
              id: "tabBorder",
              label: t("Border"),
              options: [
                {
                  id: "contentBorder",
                  type: "border-dev",
                  states: [NORMAL, HOVER]
                }
              ]
            },

            {
              id: "tabBoxShadow",
              label: t("Shadow"),
              options: [
                {
                  id: "contentBoxShadow",
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
      id: "horizontalAlign",
      type: "toggle-dev",
      disabled: true
    }
  ];
}
