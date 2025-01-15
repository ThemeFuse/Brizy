import type { ToolbarItemType } from "visual/editorComponents/ToolbarItemType";
import { getColor } from "visual/utils/color";
import { t } from "visual/utils/i18n";
import { defaultValueValue } from "visual/utils/onChange";
import type { ResponsiveMode } from "visual/utils/responsiveMode";
import { HOVER, NORMAL, State } from "visual/utils/stateMode";
import type { EcwidToolbarCSSData, Value } from "./utils/Value";

export const ecwidToolbarFooter = (
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

    const footerColor = getColor(
      dvv("footerColorPalette"),
      dvv("footerColorHex"),
      dvv("footerColorOpacity")
    );

    return [
      {
        id: "toolbarCurrentElement",
        type: "popover",
        config: {
          title: t("Icon"),
          icon: "nc-user"
        },
        position: 10,
        options: [
          {
            id: "groupSize",
            type: "group",
            options: [
              {
                id: "footerIconSize",
                label: t("Size"),
                type: "radioGroup",
                choices: [
                  { value: "small", icon: "nc-16" },
                  { value: "medium", icon: "nc-24" },
                  { value: "large", icon: "nc-32" },
                  { value: "custom", icon: "nc-more" }
                ],
                ...data?.["footerIconSize"]
              },
              {
                id: "footerIconCustomSize",
                type: "slider",
                disabled: dvv("footerIconSize") !== "custom",
                config: {
                  min: 8,
                  max: 50,
                  units: [{ title: "px", value: "px" }]
                },
                ...data?.["footerIconCustomSize"]
              }
            ]
          }
        ]
      },
      {
        id: "popoverTypography",
        type: "popover",
        config: {
          icon: "nc-font",
          size: device === "desktop" ? "large" : "auto",
          title: t("Typography")
        },
        position: 20,
        options: [
          {
            id: "footerTypography",
            type: "typography",
            config: {
              fontFamily: device === "desktop"
            },
            ...data?.["footerTypography"]
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
              backgroundColor: footerColor
            }
          }
        },
        devices: "desktop",
        position: 30,
        options: [
          {
            id: "tabsColor",
            type: "tabs",
            tabs: [
              {
                id: "tabColorFooter",
                label: t("Text"),
                options: [
                  {
                    id: "footerColor",
                    type: "colorPicker",
                    states: [NORMAL, HOVER],
                    ...data?.["footerColor"]
                  }
                ]
              },
              {
                id: "tabColorFooterIcon",
                label: t("Icon"),
                options: [
                  {
                    id: "footerIconColor",
                    type: "colorPicker",
                    states: [NORMAL, HOVER],
                    ...data?.["footerIconColor"]
                  }
                ]
              }
            ]
          }
        ]
      },
      {
        id: "toolbarSettings",
        type: "popover",
        config: { icon: "nc-cog", title: t("Settings") },
        position: 40,
        options: [
          {
            id: "footerSpacing",
            type: "slider",
            label: t("Spacing"),
            config: {
              min: 0,
              max: 100,
              units: [{ title: "px", value: "px" }]
            },
            ...data?.["footerSpacing"]
          }
        ]
      }
    ];
  }
});
