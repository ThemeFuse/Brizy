import { ToolbarItemType } from "visual/editorComponents/ToolbarItemType";
import { hexToRgba } from "visual/utils/color";
import { t } from "visual/utils/i18n";
import { defaultValueValue } from "visual/utils/onChange";
import { getOptionColorHexByPalette } from "visual/utils/options";
import { ResponsiveMode } from "visual/utils/responsiveMode";
import { State } from "visual/utils/stateMode";
import { Value } from "./types/Value";

export function getItems({
  v,
  device,
  state
}: {
  v: Value;
  device: ResponsiveMode;
  state: State;
}): ToolbarItemType[] {
  const dvv = (key: string) => defaultValueValue({ v, key, device, state });

  const { hex: footerColorHex } = getOptionColorHexByPalette(
    dvv("footerColorHex"),
    dvv("footerColorPalette")
  );

  return [
    {
      id: "toolbarCurrentElement",
      type: "popover-dev",
      config: {
        title: t("Icon"),
        icon: "nc-user"
      },
      position: 10,
      options: [
        {
          id: "groupSize",
          type: "group-dev",
          options: [
            {
              id: "footerIconSize",
              label: t("Size"),
              type: "radioGroup-dev",
              choices: [
                { value: "small", icon: "nc-16" },
                { value: "medium", icon: "nc-24" },
                { value: "large", icon: "nc-32" },
                { value: "custom", icon: "nc-more" }
              ]
            },
            {
              id: "footerIconCustomSize",
              type: "slider-dev",
              disabled: dvv("footerIconSize") !== "custom",
              config: {
                min: 8,
                max: 50,
                units: [{ title: "px", value: "px" }]
              }
            }
          ]
        }
      ]
    },
    {
      id: "popoverTypography",
      type: "popover-dev",
      config: {
        icon: "nc-font",
        size: device === "desktop" ? "large" : "auto",
        title: t("Typography")
      },
      position: 20,
      options: [
        {
          id: "footerTypography",
          type: "typography-dev",
          config: {
            fontFamily: device === "desktop"
          }
        }
      ]
    },
    {
      id: "toolbarColor",
      type: "popover-dev",
      config: {
        size: "auto",
        title: t("Colors"),
        icon: {
          style: {
            backgroundColor: hexToRgba(
              footerColorHex,
              dvv("footerColorOpacity")
            )
          }
        }
      },
      devices: "desktop",
      position: 30,
      options: [
        {
          id: "tabsColor",
          type: "tabs-dev",
          tabs: [
            {
              id: "tabColorFooter",
              label: t("Text"),
              options: [
                {
                  id: "footerColor",
                  type: "colorPicker-dev"
                }
              ]
            },
            {
              id: "tabColorFooterIcon",
              label: t("Icon"),
              options: [
                {
                  id: "footerIconColor",
                  type: "colorPicker-dev"
                }
              ]
            }
          ]
        }
      ]
    },
    {
      id: "toolbarSettings",
      type: "popover-dev",
      config: { icon: "nc-cog", title: t("Settings") },
      position: 40,
      options: [
        {
          id: "footerSpacing",
          type: "slider-dev",
          label: t("Spacing"),
          config: {
            min: 0,
            max: 100,
            units: [{ title: "px", value: "px" }]
          }
        }
      ]
    }
  ];
}
