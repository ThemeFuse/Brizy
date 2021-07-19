import { t } from "visual/utils/i18n";
import { hexToRgba } from "visual/utils/color";
import { getOptionColorHexByPalette } from "visual/utils/options";
import { defaultValueValue, defaultValueKey } from "visual/utils/onChange";
import { capitalize } from "visual/utils/string";
import { getDynamicContentChoices } from "visual/utils/options";

import { NORMAL, HOVER } from "visual/utils/stateMode";
import { DCTypes } from "visual/global/Config/types/DynamicContent";

export function getItems({ v, device, context }) {
  const dvk = key => defaultValueKey({ key, device, state: "normal" });
  const dvv = key => defaultValueValue({ v, key, device, state: "normal" });

  const isStyle1 = v.ratingStyle === "style1";
  const { hex: ratingColorHex } = getOptionColorHexByPalette(
    dvv("ratingColorHex"),
    dvv("ratingColorPalette")
  );
  const { hex: style2RatingColorHex } = getOptionColorHexByPalette(
    dvv("style2BgColorHex"),
    dvv("style2BgColorPalette")
  );
  const richTextDC = getDynamicContentChoices(
    context.dynamicContent.config,
    DCTypes.richText
  );

  return [
    {
      id: "toolbarCurrentShortcode",
      type: "popover-dev",
      config: {
        icon: "nc-starrating",
        title: t("Rating")
      },
      position: 60,
      options: [
        {
          id: "tabsCurrentElement",
          type: "tabs-dev",
          tabs: [
            {
              id: "tabCurrentElement",
              label: t("Rating"),
              roles: ["admin"],
              options: [
                {
                  id: "ratingStyle",
                  label: t("Style"),
                  type: "radioGroup-dev",
                  devices: "desktop",
                  choices: [
                    { value: "style1", icon: "nc-rating-style-1" },
                    { value: "style2", icon: "nc-rating-style-2" }
                  ]
                },
                {
                  id: "groupStyle",
                  type: "group-dev",
                  options: [
                    {
                      id: "label",
                      label: t("Label"),
                      type: "radioGroup-dev",
                      devices: "desktop",
                      choices: [
                        { value: "on", icon: "nc-align-left" },
                        { value: "on-right", icon: "nc-align-right" },
                        { value: "off", icon: "nc-close" }
                      ]
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
                  id: "borderRadius",
                  label: t("Corner"),
                  type: "slider-dev",
                  disabled: isStyle1,
                  config: {
                    min: 0,
                    max: 50,
                    units: [{ title: "px", value: "px" }]
                  }
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
                    inputMin: 0,
                    inputMax: 5,
                    units: [
                      {
                        title: "/5",
                        value: "/5"
                      }
                    ]
                  },
                  population: richTextDC
                }
              ]
            },
            {
              id: "tabStarRatingIcons",
              label: isStyle1 ? t("Icons") : t("Icon"),
              roles: ["admin"],
              options: [
                {
                  id: "iconImage",
                  label: t("Icon"),
                  type: "iconSetter",
                  devices: "desktop",
                  disabled: !isStyle1 && v.label === "off",
                  value: {
                    name: v.iconName,
                    type: v.iconType
                  },
                  onChange: ({ name, type }) => ({
                    iconName: name,
                    iconType: type
                  })
                },
                {
                  id: "groupSettings",
                  type: "group-dev",
                  disabled: !isStyle1 && v.label === "off",
                  options: [
                    {
                      id: dvk("iconSize"),
                      label: t("Size"),
                      type: "radioGroup",
                      choices: [
                        { value: "small", icon: "nc-16" },
                        { value: "medium", icon: "nc-24" },
                        { value: "large", icon: "nc-32" },
                        { value: "custom", icon: "nc-more" }
                      ],
                      value: dvv("iconSize"),
                      onChange: value => {
                        return {
                          [dvk("iconSize")]: value,
                          [dvk("iconCustomSize")]:
                            value !== "custom"
                              ? dvv(`icon${capitalize(value)}Size`)
                              : dvv("iconCustomSize")
                        };
                      }
                    },
                    {
                      id: "iconCustomSize",
                      type: "slider-dev",
                      disabled: dvv("iconSize") !== "custom",
                      config: {
                        min: 8,
                        max: 50,
                        units: [{ title: "px", value: "px" }]
                      }
                    }
                  ]
                },
                {
                  id: "iconSpacing",
                  label: t("Spacing"),
                  type: "slider-dev",
                  disabled: !isStyle1,
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
      id: "toolbarTypography",
      type: "popover-dev",
      config: {
        icon: "nc-font",
        size: device === "desktop" ? "large" : "auto",
        title: t("Typography")
      },
      disabled: v.label === "off" && isStyle1,
      position: 70,
      options: [
        {
          id: "gridTypography",
          type: "grid",
          columns: [
            {
              width: 95,
              vAlign: "center",
              options: [
                {
                  id: "",
                  type: "typography-dev",
                  disabled: v.label === "off" && isStyle1,
                  config: {
                    fontFamily: device === "desktop"
                  }
                }
              ]
            },
            {
              width: 5,
              vAlign: "center",
              options: [
                {
                  id: "text",
                  type: "population-dev",
                  config: {
                    iconOnly: true,
                    choices: richTextDC
                  },
                  devices: "desktop"
                }
              ]
            }
          ]
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
            backgroundColor: isStyle1
              ? hexToRgba(ratingColorHex, dvv("ratingColorOpacity"))
              : hexToRgba(style2RatingColorHex, dvv("style2BgColorOpacity"))
          }
        }
      },
      position: 90,
      devices: "desktop",
      options: [
        {
          id: "tabsColor",
          type: "tabs-dev",
          tabs: [
            {
              id: "tabText",
              label: t("Text"),
              devices: "desktop",
              options: [
                {
                  id: "color",
                  type: "colorPicker-dev",
                  disabled: v.label === "off" && isStyle1,
                  devices: "desktop",
                  states: [NORMAL, HOVER]
                }
              ]
            },
            {
              id: "tabRating",
              label: t("Rating"),
              devices: "desktop",
              options: [
                {
                  id: "ratingColor",
                  type: "colorPicker-dev",
                  devices: "desktop",
                  disabled: !isStyle1,
                  states: [NORMAL, HOVER]
                }
              ]
            },
            {
              id: "tabBackground",
              label: t("Background"),
              devices: "desktop",
              options: [
                {
                  id: isStyle1 ? "ratingBackgroundColor" : "bgColor",
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
      id: "advancedSettings",
      type: "advancedSettings",
      sidebarLabel: t("More Settings"),
      roles: ["admin"],
      position: 110,
      icon: "nc-cog"
    }
  ];
}
