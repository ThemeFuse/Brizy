import { ElementModel } from "visual/component/Elements/Types";
import { GetItems } from "visual/editorComponents/EditorComponent/types";
import { DCTypes } from "visual/global/Config/types/DynamicContent";
import { getColorToolbar } from "visual/utils/color";
import { t } from "visual/utils/i18n";
import { defaultValueValue } from "visual/utils/onChange";
import { getDynamicContentOption } from "visual/utils/options";
import { HOVER, NORMAL } from "visual/utils/stateMode";

export interface Value extends ElementModel {
  ratingStyle: "style1" | "style2";

  label: "on" | "on-right" | "off";
}

export const getItems: GetItems<Value> = ({ v, device, context }) => {
  const dvv = (key: string) =>
    defaultValueValue({ v, key, device, state: "normal" });

  const ratingScale = dvv("ratingScale");
  const label = dvv("label");

  const labelOff = label === "off";
  const isStyle1 = dvv("ratingStyle") === "style1";

  const ratingColor = getColorToolbar(
    dvv("ratingColorPalette"),
    dvv("ratingColorHex"),
    dvv("ratingColorOpacity")
  );
  const style2RatingColor = getColorToolbar(
    dvv("style2BgColorPalette"),
    dvv("style2BgColorHex"),
    dvv("style2BgColorOpacity")
  );

  const richTextDC = getDynamicContentOption({
    options: context.dynamicContent.config,
    type: DCTypes.richText
  });

  return [
    {
      id: "toolbarCurrentShortcode",
      type: "popover",
      config: {
        icon: "nc-starrating",
        title: t("Rating")
      },
      position: 60,
      options: [
        {
          id: "tabsCurrentElement",
          type: "tabs",
          roles: ["admin"],
          tabs: [
            {
              id: "tabCurrentElement",
              label: t("Rating"),
              options: [
                {
                  id: "ratingScale",
                  label: t("Rating scale"),
                  type: "select",
                  devices: "desktop",
                  choices: [
                    { title: t("0-5"), value: 5 },
                    { title: t("0-10"), value: 10 }
                  ]
                },
                {
                  id: "ratingStyle",
                  label: t("Style"),
                  type: "radioGroup",
                  devices: "desktop",
                  choices: [
                    { value: "style1", icon: "nc-rating-style-1" },
                    { value: "style2", icon: "nc-rating-style-2" }
                  ]
                },
                {
                  id: "groupStyle",
                  type: "group",
                  options: [
                    {
                      id: "label",
                      label: t("Label"),
                      type: "radioGroup",
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
                      type: "slider",
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
                  type: "slider",
                  devices: "desktop",
                  config: {
                    min: 0,
                    max: ratingScale,
                    size: "short",
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
                  id: "icon",
                  label: t("Icon"),
                  type: "iconSetter",
                  devices: "desktop",
                  disabled: !isStyle1 && labelOff
                },
                {
                  id: "groupSettings",
                  type: "group",
                  disabled: !isStyle1 && labelOff,
                  options: [
                    {
                      id: "iconSize",
                      label: t("Size"),
                      type: "radioGroup",
                      choices: [
                        { value: "small", icon: "nc-16" },
                        { value: "medium", icon: "nc-24" },
                        { value: "large", icon: "nc-32" },
                        { value: "custom", icon: "nc-more" }
                      ]
                    },
                    {
                      id: "iconCustomSize",
                      type: "slider",
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
                  type: "slider",
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
      type: "popover",
      config: {
        icon: "nc-font",
        size: device === "desktop" ? "xlarge" : "auto",
        title: t("Typography")
      },
      disabled: labelOff && isStyle1,
      position: 70,
      options: [
        {
          id: "gridTypography",
          type: "grid",
          config: { separator: true },
          columns: [
            {
              id: "col-1",
              align: "center",
              size: 1,
              options: [
                {
                  id: "",
                  type: "typography",
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
              size: "auto",
              options: [
                {
                  id: "text",
                  type: "population",
                  config: {
                    ...richTextDC,
                    iconOnly: true
                  },
                  disabled: richTextDC === undefined,
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
      type: "popover",
      config: {
        size: "medium",
        title: t("Colors"),
        icon: {
          style: {
            backgroundColor: isStyle1 ? ratingColor : style2RatingColor
          }
        }
      },
      position: 90,
      devices: "desktop",
      options: [
        {
          id: "tabsColor",
          type: "tabs",
          tabs: [
            {
              id: "tabText",
              label: t("Text"),
              options: [
                {
                  id: "color",
                  type: "colorPicker",
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
                  type: "colorPicker",
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
                  type: "colorPicker",
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
      devices: "desktop",
      roles: ["admin"],
      position: 110,
      title: t("Settings")
    }
  ];
};
