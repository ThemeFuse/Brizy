import { Str } from "@brizy/readers";
import {
  AnimationStyle,
  SvgEffectTypes,
  TextEffectTypes
} from "visual/component/AnimatedHeadline/types";
import {
  parseAnimationStyle,
  parseEffectType
} from "visual/component/AnimatedHeadline/utils";
import { ElementProps } from "visual/component/Elements/Types";
import { t } from "visual/utils/i18n";
import { defaultValueValue } from "visual/utils/onChange";
import { HOVER, NORMAL } from "visual/utils/stateMode";
import { GetItems } from "../EditorComponent/types";
import {
  alignContentCSS,
  shapeDurationCSS,
  shapeStrokeCSS,
  shapeWidthCSS
} from "./css";
import { Value } from "./types";

export const getItems: GetItems<Value, ElementProps> = ({
  v,
  device,
  state,
  component
}) => {
  const dvv = (key: string): unknown =>
    defaultValueValue({ v, key, device, state });

  const animationStyle = parseAnimationStyle(dvv("animationStyle"));
  const loop = Str.read(dvv("loop")) === "on";
  const textEffectType = parseEffectType(dvv("textEffectType"));

  const isTextAnimated = animationStyle === AnimationStyle.text;
  const isAnimatedSvg = animationStyle === AnimationStyle.svg;

  const disableSelectionColor =
    !isTextAnimated || textEffectType !== TextEffectTypes.typing;

  const config = component.getGlobalConfig();

  return [
    {
      id: "toolbarCurrentShortcode",
      type: "popover",
      config: {
        icon: "t2-animated-headline",
        title: t("Style")
      },
      position: 60,
      options: [
        {
          id: "tabsCurrentShortcode",
          type: "tabs",
          tabs: [
            {
              id: "tabContent",
              label: t("Text"),
              options: [
                {
                  id: "textBefore",
                  label: t("Prefix"),
                  type: "inputText",
                  placeholder: t("Text Before"),
                  devices: "desktop"
                },
                {
                  id: "svgTextAnimated",
                  label: t("Text"),
                  type: "inputText",
                  placeholder: t("Text Highlighted"),
                  devices: "desktop",
                  disabled: isTextAnimated
                },
                {
                  id: "textAnimated",
                  label: t("Text"),
                  type: "textarea",
                  placeholder: t("Text"),
                  devices: "desktop",
                  disabled: isAnimatedSvg
                },
                {
                  id: "textAfter",
                  label: t("Suffix"),
                  type: "inputText",
                  placeholder: t("Text After"),
                  devices: "desktop"
                }
              ]
            },
            {
              id: "tabStyle",
              label: t("Style"),
              options: [
                {
                  id: "animationStyle",
                  type: "select",
                  label: t("Animate"),
                  devices: "desktop",
                  choices: [
                    { title: t("Text"), value: AnimationStyle.text },
                    { title: t("Shape"), value: AnimationStyle.svg }
                  ]
                },
                {
                  id: "textEffectType",
                  type: "select",
                  label: t("Type"),
                  devices: "desktop",
                  disabled: isAnimatedSvg,
                  choices: [
                    { title: t("Typing"), value: TextEffectTypes.typing },
                    { title: t("Clip"), value: TextEffectTypes.clip },
                    { title: t("Flip"), value: TextEffectTypes.flip },
                    { title: t("Swirl"), value: TextEffectTypes.swirl },
                    { title: t("Blinds"), value: TextEffectTypes.blinds },
                    { title: t("Drop In"), value: TextEffectTypes.dropIn },
                    { title: t("Wave"), value: TextEffectTypes.wave },
                    { title: t("Slide"), value: TextEffectTypes.slide },
                    { title: t("Slide Down"), value: TextEffectTypes.slideDown }
                  ]
                },
                {
                  id: "svgEffectType",
                  type: "select",
                  label: t("Shape"),
                  devices: "desktop",
                  disabled: isTextAnimated,
                  choices: [
                    { title: t("Circle"), value: SvgEffectTypes.circle },
                    { title: t("Curly"), value: SvgEffectTypes.curly },
                    { title: t("Underline"), value: SvgEffectTypes.underline },
                    { title: t("Diagonal"), value: SvgEffectTypes.diagonal },
                    {
                      title: t("Strike Through"),
                      value: SvgEffectTypes.strikethrough
                    },
                    {
                      title: t("Underline Zigzag"),
                      value: SvgEffectTypes.underline_zigzag
                    },
                    { title: t("X"), value: SvgEffectTypes.x },
                    { title: t("Double"), value: SvgEffectTypes.double },
                    {
                      title: t("Double Underline"),
                      value: SvgEffectTypes.double_underline
                    }
                  ]
                },
                {
                  id: "duration",
                  type: "slider",
                  label: t("Duration"),
                  config: {
                    min: 10,
                    max: 9999,
                    units: [{ value: "ms", title: t("ms") }]
                  },
                  devices: "desktop",
                  style: shapeDurationCSS
                },
                {
                  id: "loop",
                  label: t("Loop"),
                  type: "switch",
                  devices: "desktop"
                },
                {
                  id: "delay",
                  type: "slider",
                  label: t("Delay"),
                  config: {
                    min: 100,
                    max: 9999,
                    units: [{ value: "ms", title: t("ms") }]
                  },
                  devices: "desktop",
                  disabled: isTextAnimated || !loop
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
        size: "auto",
        title: t("Typography")
      },
      position: 70,
      options: [
        {
          id: "tabsTypography",
          type: "tabs",
          tabs: [
            {
              id: "tabTypographyStatic",
              label: t("Static"),
              options: [
                {
                  id: "static",
                  type: "typography",
                  config: {
                    fontFamily: device === "desktop"
                  },
                  selector:
                    "{{WRAPPER}} .brz-animatedHeadline, {{WRAPPER}} .brz-animatedHeadline-plain-text"
                }
              ]
            },
            {
              id: "tabTypographyAnimated",
              label: t("Animated"),
              options: [
                {
                  id: "animated",
                  type: "typography",
                  config: {
                    fontFamily: device === "desktop"
                  },
                  selector: "{{WRAPPER}} .brz-animatedHeadline-dynamic-wrapper"
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
        size: "auto",
        title: t("Colors"),
        icon: {
          style: {
            backgroundColor: "#000"
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
              label: t("Static"),
              options: [
                {
                  id: "color",
                  type: "colorPicker",
                  states: [NORMAL, HOVER],
                  selector: "{{WRAPPER}}:hover .brz-animatedHeadline-plain-text"
                }
              ]
            },
            {
              id: "tabTextAnimated",
              label: t("Animated"),
              options: [
                {
                  id: "animatedColor",
                  type: "colorPicker",
                  states: [NORMAL, HOVER],
                  selector:
                    "{{WRAPPER}}:hover .brz-animatedHeadline-dynamic-wrapper > span"
                }
              ]
            },
            {
              id: "tabSelectedColor",
              label: t("Selected"),
              options: [
                {
                  id: "selectedColor",
                  type: "colorPicker",
                  disabled: disableSelectionColor,
                  selector:
                    "{{WRAPPER}}:hover .brz-animatedHeadline-typing-selected > span"
                }
              ]
            },
            {
              id: "tabSelectionColor",
              label: t("Selection"),
              options: [
                {
                  id: "selection",
                  type: "backgroundColor",
                  disabled: disableSelectionColor,
                  selector:
                    "{{WRAPPER}}:hover .brz-animatedHeadline-typing-selected > span"
                }
              ]
            },
            {
              id: "tabSvgPathAnimated",
              label: t("Shape"),
              options: [
                {
                  id: "shapeColor",
                  type: "colorPicker",
                  states: [NORMAL, HOVER],
                  disabled: isTextAnimated,
                  style: shapeStrokeCSS(config)
                }
              ]
            }
          ]
        }
      ]
    },
    {
      id: "horizontalAlign",
      type: "toggle",
      position: 100,
      choices: [
        {
          icon: "nc-text-align-left",
          title: t("Align"),
          value: "left"
        },
        {
          icon: "nc-text-align-center",
          title: t("Align"),
          value: "center"
        },
        {
          icon: "nc-text-align-right",
          title: t("Align"),
          value: "right"
        }
      ],
      style: alignContentCSS
    },
    {
      id: "toolbarSettings",
      type: "popover",
      config: {
        icon: "nc-cog",
        title: t("Settings")
      },
      roles: ["admin"],
      position: 110,
      options: [
        {
          id: "widthShape",
          type: "slider",
          label: t("Width"),
          disabled: isTextAnimated,
          config: {
            min: 1,
            max: 20,
            units: [{ value: "px", title: t("px") }]
          },
          style: shapeWidthCSS
        },
        {
          id: "isBringToFront",
          type: "switch",
          label: t("Bring to Front"),
          disabled: isTextAnimated
        },
        {
          id: "grid",
          type: "grid",
          config: {
            separator: true
          },
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
    }
  ];
};
