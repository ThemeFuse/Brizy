import Config from "visual/global/Config";
import { DCTypes } from "visual/global/Config/types/DynamicContent";
import { hexToRgba } from "visual/utils/color";
import { t } from "visual/utils/i18n";
import { isStory } from "visual/utils/models";
import { defaultValueValue } from "visual/utils/onChange";
import {
  getDynamicContentChoices,
  getOptionColorHexByPalette
} from "visual/utils/options";
import { ResponsiveMode } from "visual/utils/responsiveMode";
import { HOVER, NORMAL } from "visual/utils/stateMode";
import { EditorComponentContextValue } from "../EditorComponent/EditorComponentContext";
import { ToolbarItemType } from "../ToolbarItemType";
import { Value } from "./index";
import { isDefaultLineType, isTypeWithoutWeight } from "./utils";

const getColorLabel = (style: string) => {
  switch (style) {
    case "text":
      return t("Text");
    case "icon":
      return t("Icon");
    case "default":
      return "";
  }
};

export function getItems({
  v,
  device,
  context
}: {
  v: Value;
  device: ResponsiveMode;
  context: EditorComponentContextValue;
}): ToolbarItemType[] {
  const IS_STORY = isStory(Config.getAll());

  const dvv = (key: string) =>
    defaultValueValue({ v, key, device, state: "normal" });

  const lineStyle = dvv("lineStyle");
  const style = dvv("style");

  const iconStyle = style === "icon";
  const textStyle = style === "text";
  const defaultStyle = style === "default";

  const { hex: borderColorHex } = getOptionColorHexByPalette(
    dvv("borderColorHex"),
    dvv("borderColorPalette")
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
        icon: "nc-divider",
        title: t("Style")
      },
      position: 60,
      options: [
        {
          id: "lineTabs",
          type: "tabs-dev",
          position: 10,
          tabs: [
            {
              id: "lineTab",
              label: t("Line"),
              options: [
                {
                  id: "style",
                  label: t("Style"),
                  type: "radioGroup-dev",
                  devices: "desktop",
                  position: 20,
                  choices: [
                    { value: "default", icon: "nc-line-solid" },
                    { value: "text", icon: "nc-line-text" },
                    { value: "icon", icon: "nc-line-icon" }
                  ]
                },
                {
                  id: "lineStyle",
                  label: t("Type"),
                  type: "select-dev",
                  position: 30,
                  devices: "desktop",
                  choices: [
                    { value: "solid", icon: "nc-solid", title: "" },
                    { value: "dashed", icon: "nc-dashed", title: "" },
                    { value: "dotted", icon: "nc-dotted", title: "" },
                    { value: "double", icon: "nc-double", title: "" },
                    { value: "groove", icon: "nc-groove", title: "" },
                    { value: "ridge", icon: "nc-ridge", title: "" },
                    { value: "inset", icon: "nc-inset", title: "" },
                    { value: "outset", icon: "nc-outset", title: "" },
                    {
                      title: "",
                      value: "diagonal-dash",
                      icon: "nc-diagonal-dash"
                    },
                    { title: "", value: "fence", icon: "nc-fence" },
                    { title: "", value: "fence2", icon: "nc-fence2" },
                    { title: "", value: "hand-dashes", icon: "nc-hand-dashes" },
                    { title: "", value: "hand-dots", icon: "nc-hand-dots" },
                    { title: "", value: "hand-flows", icon: "nc-hand-flows" },
                    { title: "", value: "hand-leaves", icon: "nc-hand-leaves" },
                    { title: "", value: "line-dot", icon: "nc-line-dot" },
                    { title: "", value: "stars", icon: "nc-stars" },
                    { title: "", value: "waves", icon: "nc-waves" }
                  ]
                },
                {
                  id: "weight",
                  type: "slider-dev",
                  label: t("Weight"),
                  position: 60,
                  disabled:
                    isDefaultLineType(lineStyle) ||
                    isTypeWithoutWeight(lineStyle),
                  config: {
                    min: 1,
                    max: 5,
                    units: [{ value: "px", title: "px" }],
                    step: 0.1
                  }
                },
                {
                  id: "borderWidth",
                  label: t("Height"),
                  type: "slider-dev",
                  position: 70,
                  disabled: !isDefaultLineType(lineStyle),
                  config: {
                    min: 1,
                    max: 50,
                    units: [{ value: "px", title: "px" }]
                  }
                },
                {
                  id: "amount",
                  label: t("Amount"),
                  type: "slider-dev",
                  disabled: isDefaultLineType(lineStyle),
                  config: {
                    min: 1,
                    max: 100,
                    units: [
                      { value: "px", title: "px" },
                      { value: "%", title: "%" }
                    ]
                  }
                },
                {
                  id: "lineSize",
                  label: t("Height"),
                  type: "slider-dev",
                  disabled: isDefaultLineType(lineStyle),
                  config: {
                    min: 1,
                    max: 100,
                    units: [{ value: "px", title: "px" }]
                  }
                }
              ]
            },
            {
              id: "secondTab",
              label: getColorLabel(style),
              options: [
                {
                  id: "icon",
                  label: t("Icon"),
                  type: "iconSetter-dev",
                  devices: "desktop",
                  disabled: !iconStyle
                },
                {
                  id: "horizontalAlign",
                  label: t("Align"),
                  type: "radioGroup-dev",
                  devices: "desktop",
                  disabled: defaultStyle,
                  choices: [
                    { value: "left", icon: "nc-line-align-left" },
                    { value: "center", icon: "nc-line-align-center" },
                    { value: "right", icon: "nc-line-align-right" }
                  ]
                },
                {
                  id: "groupIconSize",
                  type: "group-dev",
                  options: [
                    {
                      id: "iconSizeBtns",
                      label: t("Size"),
                      type: "radioGroup-dev",
                      disabled: !iconStyle,
                      choices: [
                        { value: "small", icon: "nc-16" },
                        { value: "medium", icon: "nc-24" },
                        { value: "large", icon: "nc-32" },
                        { value: "custom", icon: "nc-more" }
                      ]
                    },
                    {
                      id: "iconSize",
                      type: "slider-dev",
                      disabled: !iconStyle || dvv("iconSizeBtns") !== "custom",
                      config: {
                        min: 8,
                        max: 50,
                        units: [{ title: "px", value: "px" }]
                      }
                    }
                  ]
                },
                {
                  id: "spacing",
                  type: "slider-dev",
                  label: t("Spacing"),
                  disabled: defaultStyle,
                  config: {
                    units: [{ value: "px", title: "px" }]
                  }
                },
                {
                  id: "iconPadding",
                  type: "slider-dev",
                  label: t("Padding"),
                  devices: "desktop",
                  disabled: !iconStyle,
                  config: {
                    min: 0,
                    max: 100,
                    units: [{ title: "px", value: "px" }]
                  }
                },
                {
                  id: "iconRotate",
                  type: "slider-dev",
                  label: t("Rotate"),
                  devices: "desktop",
                  disabled: !iconStyle,
                  config: {
                    min: 0,
                    max: 360,
                    units: [{ title: "deg", value: "deg" }]
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
        size: device === "desktop" ? "xlarge" : "auto",
        title: t("Typography")
      },
      disabled: !textStyle,
      position: 70,
      options: [
        {
          id: "gridTypography",
          type: "grid-dev",
          config: { separator: true },
          columns: [
            {
              id: "col-1",
              size: 1,
              align: "center",
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
              id: "col-2",
              size: "auto",
              align: "center",
              options: [
                {
                  id: "text",
                  devices: "desktop",
                  type: "population-dev",
                  config: {
                    iconOnly: true,
                    choices: richTextDC
                  }
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
            backgroundColor: hexToRgba(
              borderColorHex,
              dvv("borderColorOpacity")
            )
          }
        }
      },
      devices: "desktop",
      position: 90,
      options: [
        {
          id: "tabsColor",
          type: "tabs-dev",
          tabs: [
            {
              id: "tabText",
              label: getColorLabel(style),
              options: [
                {
                  id: "color",
                  type: "colorPicker-dev",
                  disabled: defaultStyle,
                  states: [NORMAL, HOVER]
                }
              ]
            },
            {
              id: "tabLine",
              label: t("Line"),
              options: [
                {
                  id: "borderColor",
                  type: "colorPicker-dev",
                  states: [NORMAL, HOVER]
                }
              ]
            },
            {
              id: "tabBg",
              label: t("Bg"),
              options: [
                {
                  id: "iconBgColor",
                  type: "colorPicker-dev",
                  disabled: !iconStyle,
                  states: [NORMAL, HOVER]
                }
              ]
            },
            {
              id: "tabIconBorder",
              label: t("Border"),
              options: [
                {
                  id: "iconBorder",
                  type: "border-dev",
                  states: [NORMAL, HOVER],
                  disabled: !iconStyle
                }
              ]
            },
            {
              id: "tabShadow",
              label: t("Shadow"),
              options: [
                {
                  id: "boxShadow",
                  type: "boxShadow-dev",
                  states: [NORMAL, HOVER],
                  disabled: !iconStyle
                },
                {
                  id: "textShadow",
                  type: "textShadow-dev",
                  states: [NORMAL, HOVER],
                  disabled: !textStyle
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
      config: {
        icon: "nc-cog",
        title: t("Settings")
      },
      disabled: IS_STORY,
      position: 110,
      options: [
        {
          id: "width",
          label: t("Width"),
          type: "slider-dev",
          config: {
            min: 1,
            max: dvv("widthSuffix") === "px" ? 1000 : 100,
            units: [
              { value: "px", title: "px" },
              { value: "%", title: "%" }
            ]
          }
        },
        {
          id: "grid",
          type: "grid-dev",
          config: { separator: true },
          columns: [
            {
              id: "col-1",
              size: 1,
              options: [
                {
                  id: "styles",
                  type: "sidebarTabsButton-dev",
                  config: {
                    tabId: "styles",
                    text: t("Styling"),
                    icon: "nc-cog"
                  }
                }
              ]
            },
            {
              id: "col-2",
              size: 1,
              options: [
                {
                  id: "effects",
                  type: "sidebarTabsButton-dev",
                  config: {
                    tabId: "effects",
                    text: t("Effects"),
                    icon: "nc-flash"
                  }
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
      icon: "nc-cog",
      disabled: !IS_STORY,
      position: 110
    }
  ];
}
