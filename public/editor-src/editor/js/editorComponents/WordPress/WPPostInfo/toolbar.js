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
      id: dvk("toolbarCurrentShortcode"),
      type: "popover",
      icon: "nc-wp-shortcode",
      title: t("Post info"),
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
            {
              value: "author",
              title: t("Author")
            },
            {
              value: "date",
              title: t("Date")
            },
            {
              value: "time",
              title: t("Time")
            },
            {
              value: "comments",
              title: t("Comments")
            }
          ]
        },
        {
          type: "multiPicker",
          devices: "desktop",
          picker: {
            id: "large",
            label: t("Large"),
            type: "radioGroup",
            choices: [
              {
                value: "inline",
                icon: "nc-more"
              },
              {
                value: "column",
                icon: "nc-text-align-left"
              }
            ],
            value: v.large
          }
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
      id: dvk("toolbarTypography"),
      type: "popover",
      icon: "nc-font",
      size: device === "desktop" ? "large" : "auto",
      title: t("Typography"),
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
      id: dvk("toolbarColor"),
      type: "popover",
      size: "auto",
      title: t("Colors"),
      position: 90,
      icon: {
        style: {
          backgroundColor: hexToRgba(iconsColorHex, dvv("iconsColorOpacity"))
        }
      },
      options: [
        {
          id: dvk("tabsColor"),
          type: "tabs",
          value: dvv("tabsColor"),
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
