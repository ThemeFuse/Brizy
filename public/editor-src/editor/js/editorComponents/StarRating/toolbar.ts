import { ElementModel } from "visual/component/Elements/Types";
import { DCTypes } from "visual/global/Config/types/DynamicContent";
import { hexToRgba } from "visual/utils/color";
import { t } from "visual/utils/i18n";
import { defaultValueValue } from "visual/utils/onChange";
import {
  getDynamicContentChoices,
  getOptionColorHexByPalette
} from "visual/utils/options";
import { ResponsiveMode } from "visual/utils/responsiveMode";
import { HOVER, NORMAL } from "visual/utils/stateMode";
import { EditorComponentContextValue } from "../EditorComponent/EditorComponentContext";
import { ToolbarItemType } from "../ToolbarItemType";

export interface Value extends ElementModel {
  ratingStyle: "style1" | "style2";

  label: "on" | "on-right" | "off";
}

export function getItems({
  v,
  device,
  context
}: {
  v: Value;
  device: ResponsiveMode;
  context: EditorComponentContextValue;
}): ToolbarItemType[] {
  const dvv = (key: string) =>
    defaultValueValue({ v, key, device, state: "normal" });

  const ratingScale = dvv("ratingScale");
  const label = dvv("label");

  const labelOff = label === "off";
  const isStyle1 = dvv("ratingStyle") === "style1";

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
          roles: ["admin"],
          tabs: [
            {
              id: "tabCurrentElement",
              label: t("Rating"),
              options: [
                {
                  id: "ratingScale",
                  label: t("Rating scale"),
                  type: "select-dev",
                  devices: "desktop",
                  choices: [
                    { title: t("0-5"), value: 5 },
                    { title: t("0-10"), value: 10 }
                  ]
                },
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
                      disabled: labelOff,
                      config: {
                        min: 0,
                        max: 100,
                        units: [{ value: "px", title: "px" }]
                      }
                    }
                  ]
                },
                {
                  id: "rating",
                  label: t("Rating"),
                  type: "slider-dev",
                  devices: "desktop",
                  config: {
                    min: 0,
                    max: ratingScale,
                    step: 0.1,
                    inputMin: 0,
                    inputMax: ratingScale,
                    units: [
                      {
                        title: `/${ratingScale}`,
                        value: `/${ratingScale}`
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
              options: [
                {
                  id: "iconImage",
                  label: t("Icon"),
                  // @ts-expect-error old option
                  type: "iconSetter",
                  devices: "desktop",
                  disabled: !isStyle1 && labelOff,
                  value: {
                    name: dvv("iconName"),
                    type: dvv("iconType")
                  },
                  onChange: ({
                    name,
                    type
                  }: {
                    name: string;
                    type: string;
                  }) => ({
                    iconName: name,
                    iconType: type
                  })
                },
                {
                  id: "groupSettings",
                  type: "group-dev",
                  disabled: !isStyle1 && labelOff,
                  options: [
                    {
                      id: "iconSize",
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
      disabled: labelOff && isStyle1,
      position: 70,
      options: [
        {
          id: "gridTypography",
          type: "grid-dev",
          columns: [
            {
              id: "col-1",
              align: "center",
              options: [
                {
                  id: "",
                  type: "typography-dev",
                  disabled: labelOff && isStyle1,
                  config: {
                    fontFamily: device === "desktop"
                  }
                }
              ]
            },
            {
              id: "col-2",
              align: "center",
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
              options: [
                {
                  id: "color",
                  type: "colorPicker-dev",
                  disabled: labelOff && isStyle1,
                  states: [NORMAL, HOVER]
                }
              ]
            },
            {
              id: "tabRating",
              label: t("Rating"),
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
      //@ts-expect-error old option
      type: "advancedSettings",
      devices: "desktop",
      sidebarLabel: t("Styling"),
      roles: ["admin"],
      position: 110,
      icon: "nc-cog"
    }
  ];
}
