import type { ToolbarItemType } from "visual/editorComponents/ToolbarItemType";
import { getColorToolbar } from "visual/utils/color";
import { t } from "visual/utils/i18n";
import { defaultValueValue } from "visual/utils/onChange";
import type { ResponsiveMode } from "visual/utils/responsiveMode";
import { HOVER, NORMAL, State } from "visual/utils/stateMode";
import type { EcwidToolbarCSSData, Value } from "./utils/Value";

export const ecwidToolbarTitle2 = (
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

    const title2Color = getColorToolbar(
      dvv("title2ColorPalette"),
      dvv("title2ColorHex"),
      dvv("title2ColorOpacity")
    );

    return [
      {
        id: "toolbarTypographyTitle2",
        type: "popover",
        config: {
          icon: "nc-font",
          size: device === "desktop" ? "large" : "auto",
          title: t("Typography")
        },
        position: 10,
        options: [
          {
            id: "title2Typography",
            type: "typography",
            config: {
              fontFamily: device === "desktop"
            },
            ...data?.["title2Typography"]
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
              backgroundColor: title2Color
            }
          }
        },
        devices: "desktop",
        position: 20,
        options: [
          {
            id: "title2Color",
            type: "colorPicker",
            states: [NORMAL, HOVER],
            ...data?.["title2Color"]
          }
        ]
      },
      {
        id: "title2HorizontalAlign",
        type: "toggle",
        position: 30,
        choices: [
          { icon: "nc-text-align-left", title: t("Align"), value: "left" },
          { icon: "nc-text-align-center", title: t("Align"), value: "center" },
          { icon: "nc-text-align-right", title: t("Align"), value: "right" }
        ],
        ...data?.["title2HorizontalAlign"]
      },
      {
        id: "toolbarSettings",
        type: "popover",
        config: { icon: "nc-cog", title: t("Settings") },
        position: 40,
        options: [
          {
            id: "title2Spacing",
            label: t("Spacing"),
            type: "slider",
            config: {
              min: 0,
              max: 100,
              units: [{ value: "px", title: "px" }]
            },
            ...data?.["title2Spacing"]
          }
        ]
      }
    ];
  }
});
