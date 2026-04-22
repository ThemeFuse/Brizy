import { z } from "zod";
import {
  validateFonts,
  withColorDefaults,
  withFontFamilyNormalize
} from "visual/ai/adapters/prop-defaults";
import {
  colorPalette,
  fontFamilyPropertyDefinition,
  fontFamilySchema,
  fontFamilyTypeEnum,
  fontFamilyTypePropertyDefinition,
  fontStyleEnum,
  hexColor,
  onOff,
  opacity,
  textAlignEnum
} from "visual/ai/adapters/schema-primitives";
import type {
  AddToolConfig,
  HandlerDeps,
  ToolArgs,
  UpdateToolConfig
} from "visual/ai/adapters/types";
import type { ToolDefinition } from "visual/ai/entities/models";
import { log } from "visual/ai/utils/logger";
import { ElementTypes } from "visual/global/Config/types/configs/ElementTypes";
import { pipe } from "visual/utils/fp/pipe";

export const animatedHeadlinePropsSchema = z.object({
  // content
  animationStyle: z.enum(["text", "svg"]).optional(),
  textEffectType: z
    .enum([
      "typing",
      "clip",
      "flip",
      "swirl",
      "blinds",
      "dropIn",
      "wave",
      "slide",
      "slideDown"
    ])
    .optional(),
  svgEffectType: z
    .enum([
      "circle",
      "curly",
      "underline",
      "diagonal",
      "strikethrough",
      "underline_zigzag",
      "x",
      "double",
      "double_underline"
    ])
    .optional(),
  textBefore: z.string().optional(),
  textAnimated: z.string().optional(),
  svgTextAnimated: z.string().optional(),
  textAfter: z.string().optional(),
  loop: onOff.optional(),
  duration: z.number().min(10).max(9999).optional(),
  delay: z.number().min(100).max(9999).optional(),

  // alignment
  horizontalAlign: textAlignEnum.optional(),

  // static text typography
  staticFontFamily: fontFamilySchema,
  staticFontFamilyType: fontFamilyTypeEnum.optional(),
  staticFontStyle: z.union([z.literal(""), fontStyleEnum]).optional(),
  staticFontSize: z.number().min(8).max(200).optional(),
  staticFontWeight: z.number().min(100).max(900).optional(),
  staticLineHeight: z.number().min(0.5).max(5).optional(),
  staticLetterSpacing: z.number().optional(),
  staticBold: z.boolean().optional(),
  staticItalic: z.boolean().optional(),
  staticUnderline: z.boolean().optional(),
  staticStrike: z.boolean().optional(),
  staticUppercase: z.boolean().optional(),
  staticLowercase: z.boolean().optional(),

  // animated text typography
  animatedFontFamily: fontFamilySchema,
  animatedFontFamilyType: fontFamilyTypeEnum.optional(),
  animatedFontStyle: z.union([z.literal(""), fontStyleEnum]).optional(),
  animatedFontSize: z.number().min(8).max(200).optional(),
  animatedFontWeight: z.number().min(100).max(900).optional(),
  animatedLineHeight: z.number().min(0.5).max(5).optional(),
  animatedLetterSpacing: z.number().optional(),
  animatedBold: z.boolean().optional(),
  animatedItalic: z.boolean().optional(),
  animatedUnderline: z.boolean().optional(),
  animatedStrike: z.boolean().optional(),
  animatedUppercase: z.boolean().optional(),
  animatedLowercase: z.boolean().optional(),

  // text color (static text)
  colorPalette: colorPalette,
  colorHex: hexColor,
  colorOpacity: opacity,

  // animated text color
  animatedColorPalette: colorPalette,
  animatedColorHex: hexColor,
  animatedColorOpacity: opacity,

  // SVG shape color
  shapeColorPalette: colorPalette,
  shapeColorHex: hexColor,
  shapeColorOpacity: opacity,

  // selected/highlighted text color
  selectedColorPalette: colorPalette,
  selectedColorHex: hexColor,
  selectedColorOpacity: opacity
});

export type AnimatedHeadlineProps = z.infer<typeof animatedHeadlinePropsSchema>;

type Props = Record<string, unknown>;

// Custom color defaults for AnimatedHeadline-specific prefixed color keys
const ANIMATED_HEADLINE_COLOR_DEFAULTS: Array<{
  hex: string;
  palette: string;
}> = [
  { hex: "animatedColorHex", palette: "animatedColorPalette" },
  { hex: "shapeColorHex", palette: "shapeColorPalette" },
  { hex: "selectedColorHex", palette: "selectedColorPalette" }
];

const withAnimatedHeadlineColorDefaults = <T extends Props>(props: T): T => {
  const result = { ...props };

  for (const { hex, palette } of ANIMATED_HEADLINE_COLOR_DEFAULTS) {
    if (hex in result && result[hex] !== undefined && !(palette in result)) {
      (result as Props)[palette] = "";
    }
  }

  return result;
};

// Static text: custom typography requires staticFontStyle:""
const STATIC_TYPOGRAPHY_KEYS = [
  "staticFontSize",
  "staticFontWeight",
  "staticLineHeight",
  "staticLetterSpacing"
];

const inferStaticFontStyle = <T extends Props>(props: T): T =>
  !("staticFontStyle" in props) &&
  STATIC_TYPOGRAPHY_KEYS.some((k) => k in props && props[k] !== undefined)
    ? { ...props, staticFontStyle: "" }
    : props;

// Animated text: custom typography requires animatedFontStyle:""
const ANIMATED_TYPOGRAPHY_KEYS = [
  "animatedFontSize",
  "animatedFontWeight",
  "animatedLineHeight",
  "animatedLetterSpacing"
];

const inferAnimatedFontStyle = <T extends Props>(props: T): T =>
  !("animatedFontStyle" in props) &&
  ANIMATED_TYPOGRAPHY_KEYS.some((k) => k in props && props[k] !== undefined)
    ? { ...props, animatedFontStyle: "" }
    : props;

const withStaticFontFamily = <T extends Props>(props: T): T =>
  withFontFamilyNormalize(props, "static");
const withAnimatedFontFamily = <T extends Props>(props: T): T =>
  withFontFamilyNormalize(props, "animated");

export const withAnimatedHeadlineDefaults = pipe(
  withColorDefaults,
  withAnimatedHeadlineColorDefaults,
  withStaticFontFamily,
  withAnimatedFontFamily,
  inferStaticFontStyle,
  inferAnimatedFontStyle
);

const animatedHeadlinePropertyDefinitions = {
  animationStyle: {
    type: "string",
    enum: ["text", "svg"],
    description:
      "Animation mode: 'text' for text-based effects (typing, flip, etc.) or 'svg' for SVG shape effects (underline, circle, etc.)"
  },
  textEffectType: {
    type: "string",
    enum: [
      "typing",
      "clip",
      "flip",
      "swirl",
      "blinds",
      "dropIn",
      "wave",
      "slide",
      "slideDown"
    ],
    description: "Text animation effect (only used when animationStyle='text')"
  },
  svgEffectType: {
    type: "string",
    enum: [
      "circle",
      "curly",
      "underline",
      "diagonal",
      "strikethrough",
      "underline_zigzag",
      "x",
      "double",
      "double_underline"
    ],
    description:
      "SVG shape effect drawn around the text (only used when animationStyle='svg')"
  },
  textBefore: {
    type: "string",
    description: "Static prefix text displayed before the animated text"
  },
  textAnimated: {
    type: "string",
    description:
      "Animated text lines separated by newlines. Each line cycles in the animation (only used when animationStyle='text')"
  },
  svgTextAnimated: {
    type: "string",
    description:
      "Text that the SVG shape animates around (only used when animationStyle='svg')"
  },
  textAfter: {
    type: "string",
    description: "Static suffix text displayed after the animated text"
  },
  loop: {
    type: "string",
    enum: ["on", "off"],
    description: "Whether the animation loops continuously"
  },
  duration: {
    type: "number",
    description: "Animation duration in milliseconds (10-9999)",
    minimum: 10,
    maximum: 9999
  },
  delay: {
    type: "number",
    description: "Delay between animation loops in milliseconds (100-9999)",
    minimum: 100,
    maximum: 9999
  },
  // Alignment
  horizontalAlign: {
    type: "string",
    enum: ["left", "center", "right", "justify"],
    description: "Text horizontal alignment"
  },
  // Static text typography
  staticFontFamily: fontFamilyPropertyDefinition,
  staticFontFamilyType: fontFamilyTypePropertyDefinition,
  staticFontStyle: {
    type: "string",
    enum: [
      "",
      "paragraph",
      "subtitle",
      "abovetitle",
      "heading1",
      "heading2",
      "heading3",
      "heading4",
      "heading5",
      "heading6",
      "button"
    ],
    description:
      "Typography preset for static text (before/after). Set to '' (empty) to use custom values. Auto-cleared when custom static typography values are provided."
  },
  staticFontSize: {
    type: "number",
    description:
      "Static text font size in pixels. Requires staticFontStyle to be '' (auto-cleared if not set).",
    minimum: 8,
    maximum: 200
  },
  staticFontWeight: {
    type: "number",
    description:
      "Static text font weight (100=thin, 400=normal, 700=bold, 900=black). Requires staticFontStyle to be '' (auto-cleared if not set).",
    minimum: 100,
    maximum: 900
  },
  staticLineHeight: {
    type: "number",
    description:
      "Static text line height multiplier (e.g., 1.5). Requires staticFontStyle to be '' (auto-cleared if not set).",
    minimum: 0.5,
    maximum: 5
  },
  staticLetterSpacing: {
    type: "number",
    description:
      "Static text letter spacing in pixels. Requires staticFontStyle to be '' (auto-cleared if not set)."
  },
  staticBold: {
    type: "boolean",
    description: "Bold static text"
  },
  staticItalic: {
    type: "boolean",
    description: "Italic static text"
  },
  staticUnderline: {
    type: "boolean",
    description: "Underline static text"
  },
  staticStrike: {
    type: "boolean",
    description: "Strikethrough static text"
  },
  staticUppercase: {
    type: "boolean",
    description: "Transform static text to uppercase"
  },
  staticLowercase: {
    type: "boolean",
    description: "Transform static text to lowercase"
  },
  // Animated text typography
  animatedFontFamily: fontFamilyPropertyDefinition,
  animatedFontFamilyType: fontFamilyTypePropertyDefinition,
  animatedFontStyle: {
    type: "string",
    enum: [
      "",
      "paragraph",
      "subtitle",
      "abovetitle",
      "heading1",
      "heading2",
      "heading3",
      "heading4",
      "heading5",
      "heading6",
      "button"
    ],
    description:
      "Typography preset for animated text. Set to '' (empty) to use custom values. Auto-cleared when custom animated typography values are provided."
  },
  animatedFontSize: {
    type: "number",
    description:
      "Animated text font size in pixels. Requires animatedFontStyle to be '' (auto-cleared if not set).",
    minimum: 8,
    maximum: 200
  },
  animatedFontWeight: {
    type: "number",
    description:
      "Animated text font weight (100=thin, 400=normal, 700=bold, 900=black). Requires animatedFontStyle to be '' (auto-cleared if not set).",
    minimum: 100,
    maximum: 900
  },
  animatedLineHeight: {
    type: "number",
    description:
      "Animated text line height multiplier (e.g., 1.5). Requires animatedFontStyle to be '' (auto-cleared if not set).",
    minimum: 0.5,
    maximum: 5
  },
  animatedLetterSpacing: {
    type: "number",
    description:
      "Animated text letter spacing in pixels. Requires animatedFontStyle to be '' (auto-cleared if not set)."
  },
  animatedBold: {
    type: "boolean",
    description: "Bold animated text"
  },
  animatedItalic: {
    type: "boolean",
    description: "Italic animated text"
  },
  animatedUnderline: {
    type: "boolean",
    description: "Underline animated text"
  },
  animatedStrike: {
    type: "boolean",
    description: "Strikethrough animated text"
  },
  animatedUppercase: {
    type: "boolean",
    description: "Transform animated text to uppercase"
  },
  animatedLowercase: {
    type: "boolean",
    description: "Transform animated text to lowercase"
  },
  // Text color (static text)
  colorPalette: {
    type: "string",
    description:
      "Set to '' (empty string) when using colorHex. For palette colors use 'color1'-'color8'."
  },
  colorHex: {
    type: "string",
    description:
      "Static text color hex (e.g., '#FFFFFF'). Palette is auto-cleared when hex is provided."
  },
  colorOpacity: {
    type: "number",
    description: "Static text color opacity (0-1)",
    minimum: 0,
    maximum: 1
  },
  // Animated text color
  animatedColorPalette: {
    type: "string",
    description:
      "Set to '' (empty string) when using animatedColorHex. For palette colors use 'color1'-'color8'."
  },
  animatedColorHex: {
    type: "string",
    description:
      "Animated text color hex (e.g., '#FF0000'). Palette is auto-cleared when hex is provided."
  },
  animatedColorOpacity: {
    type: "number",
    description: "Animated text color opacity (0-1)",
    minimum: 0,
    maximum: 1
  },
  // SVG shape color (only used when animationStyle='svg')
  shapeColorPalette: {
    type: "string",
    description:
      "Set to '' (empty string) when using shapeColorHex. For palette colors use 'color1'-'color8'."
  },
  shapeColorHex: {
    type: "string",
    description:
      "SVG shape color hex (e.g., '#08c0ff'). Only used when animationStyle='svg'. Palette is auto-cleared when hex is provided."
  },
  shapeColorOpacity: {
    type: "number",
    description: "SVG shape color opacity (0-1)",
    minimum: 0,
    maximum: 1
  },
  // Selected/highlighted text color
  selectedColorPalette: {
    type: "string",
    description:
      "Set to '' (empty string) when using selectedColorHex. For palette colors use 'color1'-'color8'."
  },
  selectedColorHex: {
    type: "string",
    description:
      "Selected/highlighted text color hex. Palette is auto-cleared when hex is provided."
  },
  selectedColorOpacity: {
    type: "number",
    description: "Selected/highlighted text color opacity (0-1)",
    minimum: 0,
    maximum: 1
  }
} as const;

export const addAnimatedHeadlineDefinition: ToolDefinition = {
  name: "addAnimatedHeadline",
  strict: true,
  description:
    "Add an Animated Headline to an EXISTING Section. Displays text with animation effects (typing, flip, wave, etc.) or SVG shape effects (underline, circle, etc.). For new sections use generateBlock.",
  category: "element",
  parameters: {
    type: "object",
    properties: {
      containerId: {
        type: "string",
        description: "ID of the Section or Column container"
      },
      insertIndex: {
        type: "number",
        description: "Position in container (0-indexed). Omit to add at end.",
        minimum: 0
      },
      ...animatedHeadlinePropertyDefinitions
    },
    required: ["containerId"],
    additionalProperties: false
  }
};

export const updateAnimatedHeadlineDefinition: ToolDefinition = {
  name: "updateAnimatedHeadline",
  strict: true,
  description:
    "Update an Animated Headline element's properties. Use searchElements({type:'AnimatedHeadline'}) to find IDs.",
  category: "update",
  parameters: {
    type: "object",
    properties: {
      elementId: {
        type: "string",
        description: "ID of the AnimatedHeadline to update"
      },
      ...animatedHeadlinePropertyDefinitions
    },
    required: ["elementId"],
    additionalProperties: false
  }
};

export const addAnimatedHeadlineConfig: AddToolConfig = {
  kind: "add",
  definition: addAnimatedHeadlineDefinition,
  elementType: ElementTypes.AnimatedHeadline,
  schema: animatedHeadlinePropsSchema,
  defaults: withAnimatedHeadlineDefaults,
  handler: (deps: HandlerDeps, args: ToolArgs) => {
    log.tools("addAnimatedHeadline input %o", args);
    const { containerId, insertIndex, ...props } = args;

    const propsWithDefaults = withAnimatedHeadlineDefaults(props);
    const parsed = animatedHeadlinePropsSchema.safeParse(propsWithDefaults);
    if (!parsed.success) {
      return { success: false, error: parsed.error.message };
    }

    const fontError = validateFonts(deps, parsed.data);
    if (fontError) return fontError;

    const result = deps.pageRepository.addElement({
      containerId: containerId as string,
      elementType: ElementTypes.AnimatedHeadline,
      insertIndex: insertIndex as number | undefined,
      initialProperties: parsed.data
    });
    log.tools("addAnimatedHeadline output %o", result);
    return result;
  }
};

export const updateAnimatedHeadlineConfig: UpdateToolConfig = {
  kind: "update",
  definition: updateAnimatedHeadlineDefinition,
  elementType: ElementTypes.AnimatedHeadline,
  schema: animatedHeadlinePropsSchema,
  defaults: withAnimatedHeadlineDefaults,
  handler: (deps: HandlerDeps, args: ToolArgs) => {
    log.tools("updateAnimatedHeadline input %o", args);
    const { elementId, ...props } = args;

    const propsWithDefaults = withAnimatedHeadlineDefaults(props);
    const parsed = animatedHeadlinePropsSchema.safeParse(propsWithDefaults);
    if (!parsed.success) {
      return { success: false, error: parsed.error.message };
    }

    const fontError = validateFonts(deps, parsed.data);
    if (fontError) return fontError;

    const result = deps.pageRepository.updateElement({
      elementId: elementId as string,
      elementType: ElementTypes.AnimatedHeadline,
      changes: parsed.data
    });
    log.tools("updateAnimatedHeadline output %o", result);
    return result;
  }
};
