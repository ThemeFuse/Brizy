import { Num } from "@brizy/readers";
import { GetItems } from "visual/editorComponents/EditorComponent/types";
import { DCTypes } from "visual/global/Config/types/DynamicContent";
import { isStory } from "visual/providers/EditorModeProvider";
import { getColorToolbar } from "visual/utils/color";
import { t } from "visual/utils/i18n";
import { defaultValueValue } from "visual/utils/onChange";
import { getDynamicContentOption } from "visual/utils/options";
import { HOVER, NORMAL } from "visual/utils/stateMode";
import {
  alignCSS,
  amountCSS,
  borderColorCSSForCustom,
  borderColorCSSForDefault,
  colorBackgroundCSS,
  defaultLineHeightCSS,
  iconBgColorCSS,
  iconCustomSizeCSS,
  iconPaddingCSS,
  iconRotateCSS,
  iconSizeCSS,
  lineStyleCSS,
  lineTypeCSS,
  spacingCSS,
  styledLineHeightCSS,
  widthCSS
} from "./css";
import { Props, Value } from "./types";
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

export const getItems: GetItems<Value, Props> = ({
  v,
  device,
  context,
  editorMode,
  component
}) => {
  const _isStory = isStory(editorMode);

  const dvv = (key: string) =>
    defaultValueValue({ v, key, device, state: "normal" });
  const config = component.getGlobalConfig();

  const lineStyle = dvv("lineStyle");
  const style = dvv("style");
  const iconSize = dvv("iconSizeBtns");
  const weight = Num.read(dvv("weight")) ?? 1;

  const iconStyle = style === "icon";
  const textStyle = style === "text";
  const defaultStyle = style === "default";
  const isDefaultLineStyle = isDefaultLineType(lineStyle);

  const borderColor = getColorToolbar(
    dvv("borderColorPalette"),
    dvv("borderColorHex"),
    dvv("borderColorOpacity")
  );

  const richTextDC = getDynamicContentOption({
    options: context.dynamicContent.config,
    type: DCTypes.richText,
    config: { iconOnly: true }
  });

  return [
    {
      id: "toolbarCurrentShortcode",
      type: "popover",
      config: {
        icon: "nc-divider",
        title: t("Style")
      },
      position: 60,
      options: [
        {
          id: "lineTabs",
          type: "tabs",
          position: 10,
          tabs: [
            {
              id: "lineTab",
              label: t("Line"),
              options: [
                {
                  id: "style",
                  label: t("Style"),
                  type: "radioGroup",
                  devices: "desktop",
                  position: 20,
                  choices: [
                    { value: "default", icon: "nc-line-solid" },
                    { value: "text", icon: "nc-line-text" },
                    { value: "icon", icon: "nc-line-icon" }
                  ],
                  style: lineStyleCSS
                },
                {
                  id: "lineStyle",
                  label: t("Type"),
                  type: "select",
                  position: 30,
                  devices: "desktop",
                  choices: [
                    { value: "solid", icon: { name: "nc-solid" }, title: "" },
                    { value: "dashed", icon: { name: "nc-dashed" }, title: "" },
                    { value: "dotted", icon: { name: "nc-dotted" }, title: "" },
                    { value: "double", icon: { name: "nc-double" }, title: "" },
                    { value: "groove", icon: { name: "nc-groove" }, title: "" },
                    { value: "ridge", icon: { name: "nc-ridge" }, title: "" },
                    { value: "inset", icon: { name: "nc-inset" }, title: "" },
                    { value: "outset", icon: { name: "nc-outset" }, title: "" },
                    {
                      title: "",
                      value: "diagonal-dash",
                      icon: { name: "nc-diagonal-dash" }
                    },
                    { title: "", value: "fence", icon: { name: "nc-fence" } },
                    { title: "", value: "fence2", icon: { name: "nc-fence2" } },
                    {
                      title: "",
                      value: "hand-dashes",
                      icon: { name: "nc-hand-dashes" }
                    },
                    {
                      title: "",
                      value: "hand-dots",
                      icon: { name: "nc-hand-dots" }
                    },
                    {
                      title: "",
                      value: "hand-flows",
                      icon: { name: "nc-hand-flows" }
                    },
                    {
                      title: "",
                      value: "hand-leaves",
                      icon: { name: "nc-hand-leaves" }
                    },
                    {
                      title: "",
                      value: "line-dot",
                      icon: { name: "nc-line-dot" }
                    },
                    { title: "", value: "stars", icon: { name: "nc-stars" } },
                    { title: "", value: "waves", icon: { name: "nc-waves" } }
                  ],
                  style: (d) => lineTypeCSS(weight, d)
                },
                {
                  id: "weight",
                  type: "slider",
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
                  type: "slider",
                  position: 70,
                  disabled: !isDefaultLineType(lineStyle),
                  config: {
                    min: 1,
                    max: 50,
                    units: [{ value: "px", title: "px" }]
                  },
                  style: defaultLineHeightCSS
                },
                {
                  id: "amount",
                  label: t("Amount"),
                  type: "slider",
                  disabled: isDefaultLineType(lineStyle),
                  config: {
                    min: 1,
                    max: 100,
                    units: [
                      { value: "px", title: "px" },
                      { value: "%", title: "%" }
                    ]
                  },
                  style: amountCSS
                },
                {
                  id: "lineSize",
                  label: t("Height"),
                  type: "slider",
                  disabled: isDefaultLineType(lineStyle),
                  config: {
                    min: 1,
                    max: 100,
                    units: [{ value: "px", title: "px" }]
                  },
                  style: styledLineHeightCSS
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
                  type: "iconSetter",
                  devices: "desktop",
                  disabled: !iconStyle
                },
                {
                  id: "horizontalAlign",
                  label: t("Align"),
                  type: "radioGroup",
                  devices: "desktop",
                  disabled: defaultStyle,
                  choices: [
                    { value: "left", icon: "nc-line-align-left" },
                    { value: "center", icon: "nc-line-align-center" },
                    { value: "right", icon: "nc-line-align-right" }
                  ],
                  style: alignCSS
                },
                {
                  id: "groupIconSize",
                  type: "group",
                  options: [
                    {
                      id: "iconSizeBtns",
                      label: t("Size"),
                      type: "radioGroup",
                      disabled: !iconStyle,
                      choices: [
                        { value: "small", icon: "nc-16" },
                        { value: "medium", icon: "nc-24" },
                        { value: "large", icon: "nc-32" },
                        { value: "custom", icon: "nc-more" }
                      ],
                      style: iconSizeCSS
                    },
                    {
                      id: "iconSize",
                      type: "slider",
                      disabled: !iconStyle || iconSize !== "custom",
                      config: {
                        min: 8,
                        max: 50,
                        units: [{ title: "px", value: "px" }]
                      },
                      style: iconCustomSizeCSS
                    }
                  ]
                },
                {
                  id: "spacing",
                  type: "slider",
                  label: t("Spacing"),
                  disabled: defaultStyle,
                  config: {
                    units: [{ value: "px", title: "px" }]
                  },
                  style: (d) => spacingCSS(dvv("horizontalAlign"), d)
                },
                {
                  id: "iconPadding",
                  type: "slider",
                  label: t("Padding"),
                  devices: "desktop",
                  disabled: !iconStyle,
                  config: {
                    min: 0,
                    max: 100,
                    units: [{ title: "px", value: "px" }]
                  },
                  style: iconPaddingCSS
                },
                {
                  id: "iconRotate",
                  type: "slider",
                  label: t("Rotate"),
                  devices: "desktop",
                  disabled: !iconStyle,
                  config: {
                    min: 0,
                    max: 360,
                    units: [{ title: "deg", value: "deg" }]
                  },
                  style: iconRotateCSS
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
      disabled: !textStyle,
      position: 70,
      options: [
        {
          id: "gridTypography",
          type: "grid",
          config: { separator: true },
          columns: [
            {
              id: "col-1",
              size: 1,
              align: "center",
              options: [
                {
                  id: "",
                  type: "typography",
                  config: {
                    fontFamily: device === "desktop"
                  },
                  selector: "{{WRAPPER}}.brz-line-text .brz-line-content"
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
                  type: "population",
                  config: richTextDC
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
            backgroundColor: borderColor
          }
        }
      },
      devices: "desktop",
      position: 90,
      options: [
        {
          id: "tabsColor",
          type: "tabs",
          tabs: [
            {
              id: "tabText",
              label: getColorLabel(style),
              options: [
                {
                  id: "color",
                  type: "colorPicker",
                  disabled: defaultStyle,
                  states: [NORMAL, HOVER],
                  style: colorBackgroundCSS(config)
                }
              ]
            },
            {
              id: "tabLine",
              label: t("Line"),
              options: [
                {
                  id: "borderColor",
                  type: "colorPicker",
                  states: [NORMAL, HOVER],
                  disabled: !isDefaultLineStyle,
                  style: borderColorCSSForDefault(config)
                },
                {
                  id: "borderColor",
                  type: "colorPicker",
                  states: [NORMAL, HOVER],
                  disabled: isDefaultLineStyle,
                  style: borderColorCSSForCustom(config)
                }
              ]
            },
            {
              id: "tabBg",
              label: t("Bg"),
              options: [
                {
                  id: "iconBgColor",
                  type: "colorPicker",
                  disabled: !iconStyle,
                  states: [NORMAL, HOVER],
                  style: iconBgColorCSS(config)
                }
              ]
            },
            {
              id: "tabIconBorder",
              label: t("Border"),
              options: [
                {
                  id: "iconBorder",
                  type: "border",
                  states: [NORMAL, HOVER],
                  disabled: !iconStyle,
                  selector: "{{WRAPPER}}:hover .brz-line-icon-wrapper"
                }
              ]
            },
            {
              id: "tabShadow",
              label: t("Shadow"),
              options: [
                {
                  id: "boxShadow",
                  type: "boxShadow",
                  states: [NORMAL, HOVER],
                  disabled: !iconStyle,
                  selector: "{{WRAPPER}}:hover .brz-line-icon-wrapper"
                },
                {
                  id: "textShadow",
                  type: "textShadow",
                  states: [NORMAL, HOVER],
                  disabled: !textStyle,
                  selector: "{{WRAPPER}}:hover.brz-line-text .brz-line-content"
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
      config: {
        icon: "nc-cog",
        title: t("Settings")
      },
      disabled: _isStory,
      position: 110,
      options: [
        {
          id: "width",
          label: t("Width"),
          type: "slider",
          config: {
            min: 1,
            max: dvv("widthSuffix") === "px" ? 1000 : 100,
            units: [
              { value: "px", title: "px" },
              { value: "%", title: "%" }
            ]
          },
          style: widthCSS
        },
        {
          id: "grid",
          type: "grid",
          config: { separator: true },
          columns: [
            {
              id: "col-1",
              size: 1,
              options: [
                {
                  id: "styles",
                  type: "sidebarTabsButton",
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
                  type: "sidebarTabsButton",
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
      type: "advancedSettings",
      disabled: !_isStory,
      position: 110
    }
  ];
};
