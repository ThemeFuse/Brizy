import type { ToolbarItemType } from "visual/editorComponents/ToolbarItemType";
import { getColorToolbar } from "visual/utils/color";
import { t } from "visual/utils/i18n";
import { defaultValueValue } from "visual/utils/onChange";
import type { ResponsiveMode } from "visual/utils/responsiveMode";
import { HOVER, NORMAL, State } from "visual/utils/stateMode";
import type { EcwidToolbarCSSData, Value } from "./utils/Value";

export const ecwidToolbarTitle = (
  data?: EcwidToolbarCSSData
): {
  getItems: (data: {
    v: Value;
    device: ResponsiveMode;
    state: State;
  }) => ToolbarItemType[];
} => ({
  getItems: ({ v, device, state }) => {
    const dvv = (key: string) => defaultValueValue({ v, key, device, state });

    const titleColor = getColorToolbar(
      dvv("titleColorPalette"),
      dvv("titleColorHex"),
      dvv("titleColorOpacity")
    );

    return [
      {
        id: "toolbarTypographyTitle",
        type: "popover",
        config: {
          icon: "nc-font",
          size: device === "desktop" ? "large" : "auto",
          title: t("Typography")
        },
        position: 10,
        options: [
          {
            id: "titleTypography",
            type: "typography",
            config: {
              fontFamily: device === "desktop"
            },
            ...data?.["titleTypography"]
          }
        ]
      },
      {
        id: "toolbarColor",
        type: "popover",
        config: {
          size: "medium",
          title: t("Colors"),
          icon: {
            style: {
              backgroundColor: titleColor
            }
          }
        },
        devices: "desktop",
        position: 20,
        options: [
          {
            id: "titleColor",
            type: "colorPicker",
            states: [NORMAL, HOVER],
            ...data?.["titleColor"]
          }
        ]
      },
      {
        id: "titleHorizontalAlign",
        type: "toggle",
        position: 30,
        choices: [
          { icon: "nc-text-align-left", title: t("Align"), value: "left" },
          { icon: "nc-text-align-center", title: t("Align"), value: "center" },
          { icon: "nc-text-align-right", title: t("Align"), value: "right" }
        ],
        ...data?.["titleHorizontalAlign"]
      },
      {
        id: "toolbarSettings",
        type: "popover",
        config: { icon: "nc-cog", title: t("Settings") },
        devices: "desktop",
        position: 40,
        options: [
          {
            id: "titleSpacing",
            label: t("Spacing"),
            type: "slider",
            config: {
              min: 0,
              max: 100,
              units: [{ value: "px", title: "px" }]
            },
            ...data?.["titleSpacing"]
          }
        ]
      }
    ];
  }
});
