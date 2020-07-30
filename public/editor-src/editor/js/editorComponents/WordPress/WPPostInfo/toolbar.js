import { t } from "visual/utils/i18n";
import { hexToRgba } from "visual/utils/color";
import { getOptionColorHexByPalette } from "visual/utils/options";
import { defaultValueValue, defaultValueKey } from "visual/utils/onChange";

export function getItems({ v, device }) {
  const dvk = key => defaultValueKey({ key, device, state: "normal" });
  const dvv = key => defaultValueValue({ v, key, device, state: "normal" });

  const { hex: iconsColorHex } = getOptionColorHexByPalette(
    dvv("iconsColorHex"),
    dvv("iconsColorPalette")
  );

  return [
    {
      id: "toolbarCurrentShortcode",
      type: "popover-dev",
      config: {
        icon: "nc-wp-shortcode",
        title: t("Post info")
      },
      position: 60,
      options: [
        {
          id: "postElements",
          type: "multiSelect-dev",
          label: t("Elements"),
          devices: "desktop",
          config: {
            size: "medium"
          },
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
              id: dvk("tabText"),
              label: t("Text"),
              devices: "desktop",
              options: [
                {
                  id: "color",
                  type: "colorPicker-dev",
                  devices: "desktop"
                }
              ]
            },
            {
              id: dvk("colorIcons"),
              label: t("Icons"),
              devices: "desktop",
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
      id: dvk("advancedSettings"),
      type: "advancedSettings",
      sidebarLabel: t("More Settings"),
      icon: "nc-cog",
      position: 150
    }
  ];
}
