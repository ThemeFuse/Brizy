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
  linkTypes,
  onOff,
  opacity
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

export const buttonPropsSchema = z.object({
  // content
  text: z.string().optional(),

  // fill type & size
  fillType: z.enum(["filled", "outline", "default"]).optional(),
  size: z.enum(["small", "medium", "large", "custom"]).optional(),

  // typography
  fontFamily: fontFamilySchema,
  fontFamilyType: fontFamilyTypeEnum.optional(),
  fontStyle: z.union([z.literal(""), fontStyleEnum]).optional(),
  fontSize: z.number().min(8).max(200).optional(),
  fontWeight: z.number().min(100).max(900).optional(),
  lineHeight: z.number().min(0.5).max(5).optional(),
  letterSpacing: z.number().optional(),
  bold: z.boolean().optional(),
  italic: z.boolean().optional(),
  underline: z.boolean().optional(),
  strike: z.boolean().optional(),
  uppercase: z.boolean().optional(),
  lowercase: z.boolean().optional(),

  // icon
  iconName: z.string().optional(),
  iconType: z.enum(["glyph", "outline", "fa"]).optional(),
  iconPosition: z.enum(["left", "right"]).optional(),
  iconCustomSize: z.number().min(1).max(100).optional(),
  iconSpacing: z.number().min(0).max(100).optional(),

  // style - background
  bgColorPalette: colorPalette,
  bgColorHex: hexColor,
  bgColorOpacity: opacity,

  // style - text
  colorPalette: colorPalette,
  colorHex: hexColor,
  colorOpacity: opacity,

  // style - border
  borderColorPalette: colorPalette,
  borderColorHex: hexColor,
  borderColorOpacity: opacity,
  borderStyle: z.enum(["solid", "dashed", "dotted", "none"]).optional(),
  borderWidth: z.number().min(0).optional(),
  borderRadiusType: z.enum(["square", "rounded", "custom"]).optional(),
  borderRadius: z.number().min(0).optional(),

  // hover colors - background
  hoverBgColorPalette: colorPalette,
  hoverBgColorHex: hexColor,
  hoverBgColorOpacity: opacity,

  // hover colors - text
  hoverColorPalette: colorPalette,
  hoverColorHex: hexColor,
  hoverColorOpacity: opacity,

  // hover colors - border
  hoverBorderColorPalette: colorPalette,
  hoverBorderColorHex: hexColor,
  hoverBorderColorOpacity: opacity,

  // box shadow
  boxShadow: z.enum(["", "on"]).optional(),
  boxShadowColorHex: hexColor,
  boxShadowColorOpacity: opacity,
  boxShadowColorPalette: colorPalette,
  boxShadowBlur: z.number().min(0).optional(),
  boxShadowSpread: z.number().optional(),
  boxShadowVertical: z.number().optional(),
  boxShadowHorizontal: z.number().optional(),

  // padding (requires size: "custom")
  paddingTop: z.number().min(0).optional(),
  paddingRight: z.number().min(0).optional(),
  paddingBottom: z.number().min(0).optional(),
  paddingLeft: z.number().min(0).optional(),

  // gradient (requires bgColorType: "gradient")
  bgColorType: z.enum(["solid", "gradient"]).optional(),
  gradientType: z.enum(["linear", "radial"]).optional(),
  gradientColorHex: hexColor,
  gradientColorOpacity: opacity,
  gradientColorPalette: colorPalette,
  gradientLinearDegree: z.number().min(0).max(360).optional(),
  gradientStartPointer: z.number().min(0).max(100).optional(),
  gradientFinishPointer: z.number().min(0).max(100).optional(),

  // link
  linkType: linkTypes.optional(),
  linkExternal: z.string().optional(),
  linkExternalBlank: onOff.optional()
});

export type ButtonProps = z.infer<typeof buttonPropsSchema>;

type Props = Record<string, unknown>;

// borderRadius requires borderRadiusType:"custom" to render
const inferBorderRadiusType = <T extends Props>(props: T): T =>
  "borderRadius" in props &&
  props.borderRadius !== undefined &&
  !("borderRadiusType" in props)
    ? { ...props, borderRadiusType: "custom" }
    : props;

// custom padding requires size:"custom" to take effect
const inferCustomSize = <T extends Props>(props: T): T =>
  !("size" in props) &&
  (("paddingTop" in props && props.paddingTop !== undefined) ||
    ("paddingRight" in props && props.paddingRight !== undefined) ||
    ("paddingBottom" in props && props.paddingBottom !== undefined) ||
    ("paddingLeft" in props && props.paddingLeft !== undefined))
    ? { ...props, size: "custom" }
    : props;

// custom typography (fontSize, fontWeight, etc.) requires fontStyle:"" to override preset
const CUSTOM_TYPOGRAPHY_KEYS = [
  "fontSize",
  "fontWeight",
  "lineHeight",
  "letterSpacing"
];

const inferCustomFontStyle = <T extends Props>(props: T): T =>
  !("fontStyle" in props) &&
  CUSTOM_TYPOGRAPHY_KEYS.some((k) => k in props && props[k] !== undefined)
    ? { ...props, fontStyle: "" }
    : props;

export const withButtonDefaults = pipe(
  withColorDefaults,
  withFontFamilyNormalize,
  inferBorderRadiusType,
  inferCustomSize,
  inferCustomFontStyle
);

// Shared button property definitions for tool parameters
const buttonPropertyDefinitions = {
  text: {
    type: "string",
    description: "Button label text (e.g., 'Click Here', 'Learn More')"
  },
  // Fill type & size
  fillType: {
    type: "string",
    enum: ["filled", "outline", "default"],
    description:
      "Button fill style. 'filled' = solid background, 'outline' = border only (no bg), 'default' = no bg or border (text only)."
  },
  size: {
    type: "string",
    enum: ["small", "medium", "large", "custom"],
    description:
      "Button size preset. Set to 'custom' to use custom paddingTop/Right/Bottom/Left values."
  },
  // Typography
  fontFamily: fontFamilyPropertyDefinition,
  fontFamilyType: fontFamilyTypePropertyDefinition,
  fontStyle: {
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
      "Typography preset. When set, overrides fontSize/fontWeight/lineHeight/letterSpacing. Set to '' (empty) to use custom values. Auto-cleared when custom typography values are provided."
  },
  fontSize: {
    type: "number",
    description:
      "Font size in pixels. Requires fontStyle to be '' (auto-cleared if not set).",
    minimum: 8,
    maximum: 200
  },
  fontWeight: {
    type: "number",
    description:
      "Font weight (100=thin, 400=normal, 700=bold, 900=black). Requires fontStyle to be '' (auto-cleared if not set).",
    minimum: 100,
    maximum: 900
  },
  lineHeight: {
    type: "number",
    description:
      "Line height multiplier (e.g., 1.5). Requires fontStyle to be '' (auto-cleared if not set).",
    minimum: 0.5,
    maximum: 5
  },
  letterSpacing: {
    type: "number",
    description:
      "Letter spacing in pixels. Positive spreads, negative tightens. Requires fontStyle to be '' (auto-cleared if not set)."
  },
  bold: {
    type: "boolean",
    description: "Bold text"
  },
  italic: {
    type: "boolean",
    description: "Italic text"
  },
  underline: {
    type: "boolean",
    description: "Underline text"
  },
  strike: {
    type: "boolean",
    description: "Strikethrough text"
  },
  uppercase: {
    type: "boolean",
    description: "Transform text to uppercase"
  },
  lowercase: {
    type: "boolean",
    description: "Transform text to lowercase"
  },
  // Icon
  iconName: {
    type: "string",
    description:
      "EXACT icon name from getAvailableIcons. You MUST copy the name exactly as returned — do NOT modify, shorten, or rephrase it."
  },
  iconType: {
    type: "string",
    enum: ["glyph", "outline", "fa"],
    description:
      "EXACT icon type from getAvailableIcons. Must match the type returned for the chosen icon — do NOT change it."
  },
  iconPosition: {
    type: "string",
    enum: ["left", "right"],
    description: "Icon placement relative to button text"
  },
  iconCustomSize: {
    type: "number",
    description: "Icon size in pixels",
    minimum: 1,
    maximum: 100
  },
  iconSpacing: {
    type: "number",
    description: "Gap between icon and text in pixels",
    minimum: 0,
    maximum: 100
  },
  // Background color
  bgColorPalette: {
    type: "string",
    description:
      "Set to '' (empty string) when using bgColorHex. For palette colors use 'color1'-'color8'."
  },
  bgColorHex: {
    type: "string",
    description:
      "Background color hex (e.g., '#FFA500'). Palette is auto-cleared when hex is provided."
  },
  bgColorOpacity: {
    type: "number",
    description: "Background color opacity (0-1)",
    minimum: 0,
    maximum: 1
  },
  // Text color
  colorPalette: {
    type: "string",
    description:
      "Set to '' (empty string) when using colorHex. For palette colors use 'color1'-'color8'."
  },
  colorHex: {
    type: "string",
    description:
      "Text color hex (e.g., '#FFFFFF'). Palette is auto-cleared when hex is provided."
  },
  colorOpacity: {
    type: "number",
    description: "Text color opacity (0-1)",
    minimum: 0,
    maximum: 1
  },
  // Border
  borderColorPalette: {
    type: "string",
    description:
      "Set to '' when using borderColorHex. For palette colors use 'color1'-'color8'."
  },
  borderColorHex: {
    type: "string",
    description:
      "Border color hex. Palette is auto-cleared when hex is provided."
  },
  borderColorOpacity: {
    type: "number",
    description: "Border color opacity (0-1)",
    minimum: 0,
    maximum: 1
  },
  borderStyle: {
    type: "string",
    enum: ["solid", "dashed", "dotted", "none"],
    description: "Border line style"
  },
  borderWidth: {
    type: "number",
    description: "Border width in pixels",
    minimum: 0
  },
  borderRadiusType: {
    type: "string",
    enum: ["square", "rounded", "custom"],
    description:
      "Corner style. 'square' = no rounding (0px), 'rounded' = fully rounded (100px), 'custom' = use borderRadius value. MUST be set for borderRadius to take effect."
  },
  borderRadius: {
    type: "number",
    description:
      "Border radius in pixels. Only works when borderRadiusType is 'custom'. Auto-sets borderRadiusType to 'custom' if not specified.",
    minimum: 0
  },
  // Hover colors - background
  hoverBgColorHex: {
    type: "string",
    description: "Background color on hover (hex). Palette is auto-cleared."
  },
  hoverBgColorOpacity: {
    type: "number",
    description: "Hover background opacity (0-1)",
    minimum: 0,
    maximum: 1
  },
  // Hover colors - text
  hoverColorHex: {
    type: "string",
    description: "Text color on hover (hex). Palette is auto-cleared."
  },
  hoverColorOpacity: {
    type: "number",
    description: "Hover text color opacity (0-1)",
    minimum: 0,
    maximum: 1
  },
  // Hover colors - border
  hoverBorderColorHex: {
    type: "string",
    description: "Border color on hover (hex). Palette is auto-cleared."
  },
  hoverBorderColorOpacity: {
    type: "number",
    description: "Hover border color opacity (0-1)",
    minimum: 0,
    maximum: 1
  },
  // Box shadow (set boxShadow: "on" to enable)
  boxShadow: {
    type: "string",
    enum: ["", "on"],
    description:
      "Enable box shadow. MUST be 'on' for shadow properties to render. '' disables shadow."
  },
  boxShadowColorHex: {
    type: "string",
    description: "Shadow color hex. Palette is auto-cleared."
  },
  boxShadowColorOpacity: {
    type: "number",
    description: "Shadow color opacity (0-1)",
    minimum: 0,
    maximum: 1
  },
  boxShadowBlur: {
    type: "number",
    description: "Shadow blur radius in pixels",
    minimum: 0
  },
  boxShadowSpread: {
    type: "number",
    description: "Shadow spread in pixels (negative for inset shrink)"
  },
  boxShadowVertical: {
    type: "number",
    description: "Shadow vertical offset in pixels (positive = down)"
  },
  boxShadowHorizontal: {
    type: "number",
    description: "Shadow horizontal offset in pixels (positive = right)"
  },
  // Padding (requires size: "custom")
  paddingTop: {
    type: "number",
    description:
      "Top padding in pixels. Requires size: 'custom' to take effect.",
    minimum: 0
  },
  paddingRight: {
    type: "number",
    description:
      "Right padding in pixels. Requires size: 'custom' to take effect.",
    minimum: 0
  },
  paddingBottom: {
    type: "number",
    description:
      "Bottom padding in pixels. Requires size: 'custom' to take effect.",
    minimum: 0
  },
  paddingLeft: {
    type: "number",
    description:
      "Left padding in pixels. Requires size: 'custom' to take effect.",
    minimum: 0
  },
  // Gradient (set bgColorType: "gradient" to enable)
  bgColorType: {
    type: "string",
    enum: ["solid", "gradient"],
    description:
      "Background type. Set to 'gradient' for gradient properties to render. Default 'solid'."
  },
  gradientType: {
    type: "string",
    enum: ["linear", "radial"],
    description: "Gradient direction type (requires bgColorType: 'gradient')"
  },
  gradientColorHex: {
    type: "string",
    description:
      "Gradient end color hex (start color is bgColorHex). Palette is auto-cleared."
  },
  gradientColorOpacity: {
    type: "number",
    description: "Gradient end color opacity (0-1)",
    minimum: 0,
    maximum: 1
  },
  gradientLinearDegree: {
    type: "number",
    description: "Linear gradient angle in degrees (0=up, 90=right, 180=down)",
    minimum: 0,
    maximum: 360
  },
  gradientStartPointer: {
    type: "number",
    description: "Gradient start position as percentage (0-100)",
    minimum: 0,
    maximum: 100
  },
  gradientFinishPointer: {
    type: "number",
    description: "Gradient end position as percentage (0-100)",
    minimum: 0,
    maximum: 100
  },
  // Link
  linkType: {
    type: "string",
    enum: ["external"],
    description: "Type of link behavior"
  },
  linkExternal: {
    type: "string",
    description: "URL for external links (e.g., 'https://example.com')"
  },
  linkExternalBlank: {
    type: "string",
    enum: ["on", "off"],
    description: "Open link in new tab ('on') or same tab ('off')"
  }
} as const;

export const addButtonDefinition: ToolDefinition = {
  name: "addButton",
  strict: true,
  description:
    "Add a Button to an EXISTING Section. For modifying pages, not creating new sections. For new sections use generateBlock.",
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
      ...buttonPropertyDefinitions
    },
    required: ["containerId"],
    additionalProperties: false
  }
};

export const updateButtonDefinition: ToolDefinition = {
  name: "updateButton",
  strict: true,
  description:
    "Update a Button element. Use searchElements({type:'Button'}) to find button IDs first.",
  category: "update",
  parameters: {
    type: "object",
    properties: {
      elementId: {
        type: "string",
        description: "ID of the button to update"
      },
      ...buttonPropertyDefinitions
    },
    required: ["elementId"],
    additionalProperties: false
  }
};

export const addButtonConfig: AddToolConfig = {
  kind: "add",
  definition: addButtonDefinition,
  elementType: ElementTypes.Button,
  schema: buttonPropsSchema,
  defaults: withButtonDefaults,
  handler: (deps: HandlerDeps, args: ToolArgs) => {
    log.tools("addButton input %o", args);
    const { containerId, insertIndex, ...props } = args;

    const propsWithDefaults = withButtonDefaults(props);
    const parsed = buttonPropsSchema.safeParse(propsWithDefaults);
    if (!parsed.success) {
      return { success: false, error: parsed.error.message };
    }

    const fontError = validateFonts(deps, parsed.data);
    if (fontError) return fontError;

    const result = deps.pageRepository.addElement({
      containerId: containerId as string,
      elementType: ElementTypes.Button,
      insertIndex: insertIndex as number | undefined,
      initialProperties: parsed.data
    });
    log.tools("addButton output %o", result);
    return result;
  }
};

export const updateButtonConfig: UpdateToolConfig = {
  kind: "update",
  definition: updateButtonDefinition,
  elementType: ElementTypes.Button,
  schema: buttonPropsSchema,
  defaults: withButtonDefaults,
  handler: (deps: HandlerDeps, args: ToolArgs) => {
    log.tools("updateButton input %o", args);
    const { elementId, ...props } = args;

    const propsWithDefaults = withButtonDefaults(props);
    const parsed = buttonPropsSchema.safeParse(propsWithDefaults);
    if (!parsed.success) {
      return { success: false, error: parsed.error.message };
    }

    const fontError = validateFonts(deps, parsed.data);
    if (fontError) return fontError;

    const result = deps.pageRepository.updateElement({
      elementId: elementId as string,
      elementType: ElementTypes.Button,
      changes: parsed.data
    });
    log.tools("updateButton output %o", result);
    return result;
  }
};
