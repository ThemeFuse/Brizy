import { ElementModel } from "visual/component/Elements/Types";
import { ToolbarItemType } from "visual/editorComponents/ToolbarItemType";
import { hexToRgba } from "visual/utils/color";
import { t } from "visual/utils/i18n";
import { defaultValueValue } from "visual/utils/onChange";
import { getOptionColorHexByPalette } from "visual/utils/options";
import { ResponsiveMode } from "visual/utils/responsiveMode";

export interface Value extends ElementModel {
  iconsColorHex: string;
  iconsColorPalette: string;
  iconsColorOpacity: number;
}

export function getItems({
  v,
  device
}: {
  v: Value;
  device: ResponsiveMode;
}): ToolbarItemType[] {
  const dvv = (key: string) =>
    defaultValueValue({ v, key, device, state: "normal" });

  const { hex: iconsColorHex } = getOptionColorHexByPalette(
    dvv("iconsColorHex"),
    dvv("iconsColorPalette")
  );

  return [
    {
      id: "toolbarCurrentShortcode",
      type: "popover-dev",
      config: {
        icon: "nc-wp-post-info",
        title: t("Post info")
      },
      position: 60,
      options: [
        {
          id: "postElements",
          type: "multiSelect-dev",
          label: t("Elements"),
          placeholder: t("0 Selected"),
          devices: "desktop",
          choices: [
            { value: "author", title: t("Author") },
            { value: "date", title: t("Date") },
            { value: "time", title: t("Time") },
            { value: "comments", title: t("Comments") }
          ]
        },
        {
          id: "large",
          label: t("Orientation"),
          type: "radioGroup-dev",
          devices: "desktop",
          choices: [
            { value: "inline", icon: "nc-horizontal-items" },
            { value: "column", icon: "nc-vertical-items" }
          ]
        },
        {
          id: "textSpacing",
          label: t("Spacing"),
          type: "slider-dev",
          config: {
            min: 0,
            max: 100,
            units: [{ value: "px", title: "px" }]
          }
        }
      ]
    },
    {
      id: "toolbarTypography",
      type: "popover-dev",
      config: {
        icon: "nc-font",
        size: device === "desktop" ? "large" : "auto",
        title: t("Typography")
      },
      roles: ["admin"],
      position: 70,
      options: [
        {
          id: "",
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
            backgroundColor: hexToRgba(iconsColorHex, dvv("iconsColorOpacity"))
          }
        }
      },
      position: 90,
      options: [
        {
          id: "tabsColor",
          type: "tabs-dev",
          tabs: [
            {
              id: "tabText",
              label: t("Text"),
              options: [
                {
                  id: "color",
                  type: "colorPicker-dev",
                  devices: "desktop"
                }
              ]
            },
            {
              id: "colorIcons",
              label: t("Icons"),
              options: [
                {
                  id: "iconsColor",
                  type: "colorPicker-dev",
                  devices: "desktop"
                }
              ]
            }
          ]
        }
      ]
    },
    {
      id: "advancedSettings",
      // @ts-expect-error: old option
      type: "advancedSettings",
      devices: "desktop",
      icon: "nc-cog",
      position: 150
    }
  ];
}
