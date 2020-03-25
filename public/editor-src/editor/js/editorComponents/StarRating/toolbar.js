import { t } from "visual/utils/i18n";
import { hexToRgba } from "visual/utils/color";
import { getOptionColorHexByPalette } from "visual/utils/options";
import { defaultValueValue, defaultValueKey } from "visual/utils/onChange";
import { toolbarIconSize } from "visual/utils/toolbar";

import { NORMAL, HOVER } from "visual/utils/stateMode";

export function getItems({ v, device }) {
  const dvk = key => defaultValueKey({ key, device, state: "normal" });
  const dvv = key => defaultValueValue({ v, key, device, state: "normal" });

  const { hex: bgColorHex } = getOptionColorHexByPalette(
    dvv("bgColorHex"),
    dvv("bgColorPalette")
  );

  return [
    {
      id: dvk("toolbarCurrentShortcode"),
      type: "popover",
      icon: "nc-starrating",
      title: t("Rating"),
      position: 60,
      options: [
        {
          id: dvk("tabsCurrentElement"),
          type: "tabs",
          tabs: [
            {
              id: dvk("tabCurrentElement"),
              label: t("Rating"),
              roles: ["admin"],
              options: [
                {
                  id: "label",
                  label: t("Label"),
                  type: "switch-dev",
                  devices: "desktop"
                },
                {
                  id: "rating",
                  label: t("Rating"),
                  type: "slider-dev",
                  devices: "desktop",
                  config: {
                    min: 0,
                    max: 5,
                    step: 0.1,
                    units: [
                      {
                        title: "/5",
                        value: "/5"
                      }
                    ]
                  }
                },
                {
                  id: "spacing",
                  label: t("Spacing"),
                  type: "slider-dev",
                  disabled: v.label === "off",
                  config: {
                    min: 0,
                    max: 100,
                    units: [{ value: "px", title: "px" }]
                  }
                }
              ]
            },
            {
              id: dvk("tabStarRatingIcons"),
              label: t("Icons"),
              roles: ["admin"],
              options: [
                {
                  id: "iconImage",
                  label: t("Icon"),
                  type: "iconSetter",
                  devices: "desktop",
                  value: {
                    name: v.iconName,
                    type: v.iconType
                  },
                  onChange: ({ name, type }) => ({
                    iconName: name,
                    iconType: type
                  })
                },
                toolbarIconSize({
                  v,
                  device,
                  state: "normal"
                }),
                {
                  id: "iconSpacing",
                  label: t("Spacing"),
                  type: "slider-dev",
                  config: {
                    min: 0,
                    max: 20,
                    units: [{ value: "px", title: "px" }]
                  }
                }
              ]
            }
          ]
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
          disabled: v.label === "off",
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
      devices: "desktop",
      icon: {
        style: {
          backgroundColor: hexToRgba(bgColorHex, dvv("bgColorOpacity"))
        }
      },
      options: [
        {
          id: dvk("tabsColor"),
          type: "tabs",
          tabs: [
            {
              id: dvk("tabText"),
              label: t("Text"),
              devices: "desktop",
              options: [
                {
                  id: "color",
                  type: "colorPicker-dev",
                  disabled: v.label === "off",
                  devices: "desktop",
                  states: [NORMAL, HOVER]
                }
              ]
            },
            {
              id: dvk("tabRating"),
              label: t("Rating"),
              devices: "desktop",
              options: [
                {
                  id: "ratingColor",
                  type: "colorPicker-dev",
                  devices: "desktop",
                  states: [NORMAL, HOVER]
                }
              ]
            },
            {
              id: dvk("tabBackground"),
              label: t("Background"),
              devices: "desktop",
              options: [
                {
                  id: "ratingBackgroundColor",
                  type: "colorPicker-dev",
                  devices: "desktop",
                  states: [NORMAL, HOVER]
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
      roles: ["admin"],
      position: 110,
      icon: "nc-cog"
    }
  ];
}
