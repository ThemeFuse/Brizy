import { z } from "zod";

// Common hex color — required variant and optional variant
export const hexColorRequired = z
  .string()
  .regex(/^#[0-9A-Fa-f]{6}$/, "Hex color must be in format '#RRGGBB'");

export const hexColor = hexColorRequired.optional();

export const opacity = z.number().min(0).max(1).optional();

// Palette slot IDs
export const paletteIdEnum = z.enum([
  "color1",
  "color2",
  "color3",
  "color4",
  "color5",
  "color6",
  "color7",
  "color8"
]);

// Palette can be color1-color8 or empty string to use custom hex
export const colorPalette = z.string().optional();

// Single palette color entry (id + hex)
export const paletteColorSchema = z.object({
  id: paletteIdEnum,
  hex: hexColorRequired
});

// Container element ID — must be a non-empty string. Targets the
// Section/Column an element is added into. Validated at handler entry
// so a missing/blank id fails fast with a clear message.
export const containerIdSchema = z
  .string({ required_error: "containerId is required" })
  .min(1, "containerId is required and must be a non-empty string");

export const linkTypes = z.enum(["external"]);
export const onOff = z.enum(["on", "off"]);

// Check for HTML tags - LLM must send plain text only
export const plainText = z
  .string()
  .refine((val) => !/<[a-z][\s\S]*>/i.test(val), {
    message:
      "HTML is not allowed. Use plain text only. For styling, use fontStyle, fontSize, fontWeight, colorHex parameters."
  });

// Font style presets
export const fontStyleEnum = z.enum([
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
]);

// Font source type
export const fontFamilyTypeEnum = z.enum([
  "google",
  "upload",
  "adobe",
  "system"
]);

// Typography ranges
export const fontSize = z.number().min(1).max(200);
export const fontWeight = z.number().min(100).max(900);
export const lineHeight = z.number().min(0.5).max(5);
export const letterSpacing = z.number();

// Text alignment
export const textAlignEnum = z.enum(["left", "center", "right", "justify"]);

// Element-level font family (optional, for overriding the style preset)
export const fontFamilySchema = z.string().min(1).optional();

// Background/gradient shared primitives for container elements
export const bgColorTypeContainer = z
  .enum(["solid", "gradient", "animated-gradient"])
  .optional();
export const gradientType = z.enum(["linear", "radial"]).optional();
export const gradientLinearDegree = z.number().min(0).max(360).optional();
export const gradientRadialDegree = z.number().min(0).max(360).optional();
export const gradientPointer = z.number().min(0).max(100).optional();
export const gradientSpeed = z.number().min(1).max(10).optional();
export const borderStyleEnum = z
  .enum(["solid", "dashed", "dotted", "none"])
  .optional();

export const gradientStopSchema = z.object({
  position: z.number().min(0).max(100),
  hex: hexColorRequired,
  opacity: z.number().min(0).max(1),
  palette: z.string()
});
export const gradientStopsSchema = z
  .array(gradientStopSchema)
  .min(2)
  .optional();
export const activeStopIndexSchema = z.number().int().min(0).optional();

// Shared tool definition properties for fontFamily + fontFamilyType
export const fontFamilyPropertyDefinition = {
  type: "string",
  description:
    "Font family in builder format: lowercase with underscores (e.g. 'open_sans', 'allura', 'playfair_display'). Setting this overrides the fontStyle preset. The system auto-normalizes. IMPORTANT: You MUST call getProjectFonts first to verify the font exists in the project. NEVER guess or invent font names — if the font is not in the project, use addFont to add it first."
} as const;

export const fontFamilyTypePropertyDefinition = {
  type: "string",
  enum: ["google", "upload", "adobe", "system"],
  description: "Font source type. Required when setting fontFamily."
} as const;

export const containerOverlayAndBorderPropertyDefinitions = {
  // Normal bg type
  bgColorType: {
    type: "string",
    enum: ["solid", "gradient", "animated-gradient"],
    description:
      "Background type. 'gradient' = static gradient, 'animated-gradient' = color-cycling animated gradient. Set bgColorHex (start) and gradientColorHex (end) alongside this."
  },
  // Normal gradient
  gradientType: {
    type: "string",
    enum: ["linear", "radial"],
    description:
      "Gradient direction. Requires bgColorType: 'gradient' or 'animated-gradient'."
  },
  gradientColorPalette: {
    type: "string",
    description:
      "Set to '' when using gradientColorHex. For palette colors use 'color1'-'color8'."
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
  gradientRadialDegree: {
    type: "number",
    description: "Radial gradient degree",
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
  gradientSpeed: {
    type: "number",
    description:
      "Animated gradient cycle speed (1=slow, 10=fast). Only for 'animated-gradient'.",
    minimum: 1,
    maximum: 10
  },
  gradientStops: {
    type: "array",
    description:
      "Color stops for animated-gradient. Min 2. Each stop: position (0-100), hex ('#RRGGBB'), opacity (0-1), palette ('' or 'color1'-'color8'). When omitted, stops are auto-synthesized from bgColorHex and gradientColorHex.",
    items: {
      type: "object",
      properties: {
        position: { type: "number", minimum: 0, maximum: 100 },
        hex: { type: "string" },
        opacity: { type: "number", minimum: 0, maximum: 1 },
        palette: { type: "string" }
      },
      required: ["position", "hex", "opacity", "palette"],
      additionalProperties: false
    }
  },
  activeStopIndex: {
    type: "number",
    description:
      "Index of the active gradient stop (0-based). Only for 'animated-gradient'.",
    minimum: 0
  },
  // Hover - overlay (bg + gradient)
  hoverBgColorPalette: {
    type: "string",
    description:
      "Set to '' when using hoverBgColorHex. For palette colors use 'color1'-'color8'."
  },
  hoverBgColorHex: {
    type: "string",
    description: "Background color on hover (hex). Palette is auto-cleared."
  },
  hoverBgColorOpacity: {
    type: "number",
    description: "Hover background color opacity (0-1)",
    minimum: 0,
    maximum: 1
  },
  hoverBgColorType: {
    type: "string",
    enum: ["solid", "gradient", "animated-gradient"],
    description:
      "Hover background type. 'gradient' = static gradient, 'animated-gradient' = animated. Set hoverBgColorHex (start) and hoverGradientColorHex (end) alongside this."
  },
  hoverGradientType: {
    type: "string",
    enum: ["linear", "radial"],
    description:
      "Hover gradient direction. Requires hoverBgColorType: 'gradient' or 'animated-gradient'."
  },
  hoverGradientColorPalette: {
    type: "string",
    description:
      "Set to '' when using hoverGradientColorHex. For palette colors use 'color1'-'color8'."
  },
  hoverGradientColorHex: {
    type: "string",
    description: "Hover gradient end color hex. Palette is auto-cleared."
  },
  hoverGradientColorOpacity: {
    type: "number",
    description: "Hover gradient end color opacity (0-1)",
    minimum: 0,
    maximum: 1
  },
  hoverGradientLinearDegree: {
    type: "number",
    description: "Hover linear gradient angle in degrees",
    minimum: 0,
    maximum: 360
  },
  hoverGradientRadialDegree: {
    type: "number",
    description: "Hover radial gradient degree",
    minimum: 0,
    maximum: 360
  },
  hoverGradientStartPointer: {
    type: "number",
    description: "Hover gradient start position as percentage (0-100)",
    minimum: 0,
    maximum: 100
  },
  hoverGradientFinishPointer: {
    type: "number",
    description: "Hover gradient end position as percentage (0-100)",
    minimum: 0,
    maximum: 100
  },
  hoverGradientSpeed: {
    type: "number",
    description: "Hover animated gradient speed (1=slow, 10=fast)",
    minimum: 1,
    maximum: 10
  },
  hoverGradientStops: {
    type: "array",
    description:
      "Color stops for hover animated-gradient. Min 2. Same shape as gradientStops. Auto-synthesized from hoverBgColorHex and hoverGradientColorHex when omitted.",
    items: {
      type: "object",
      properties: {
        position: { type: "number", minimum: 0, maximum: 100 },
        hex: { type: "string" },
        opacity: { type: "number", minimum: 0, maximum: 1 },
        palette: { type: "string" }
      },
      required: ["position", "hex", "opacity", "palette"],
      additionalProperties: false
    }
  },
  hoverActiveStopIndex: {
    type: "number",
    description:
      "Index of the active hover gradient stop (0-based). Only for hover 'animated-gradient'.",
    minimum: 0
  },
  // Hover - border
  hoverBorderColorPalette: {
    type: "string",
    description:
      "Set to '' when using hoverBorderColorHex. For palette colors use 'color1'-'color8'."
  },
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
  hoverBorderStyle: {
    type: "string",
    enum: ["solid", "dashed", "dotted", "none"],
    description: "Border line style on hover"
  },
  hoverBorderWidth: {
    type: "number",
    description: "Border width on hover in pixels",
    minimum: 0
  }
} as const;

/** Zod schema fields for a prefixed font family pair (e.g. body → bodyFontFamily). */
export function fontFamilySchemaPair(
  prefix = ""
): Record<string, z.ZodTypeAny> {
  const familyKey = prefix ? `${prefix}FontFamily` : "fontFamily";
  const typeKey = prefix ? `${prefix}FontFamilyType` : "fontFamilyType";

  return {
    [familyKey]: fontFamilySchema,
    [typeKey]: fontFamilyTypeEnum.optional()
  };
}

/** Tool parameter definition for a single fontFamily field. */
export function fontFamilyProperty(description?: string) {
  if (!description) {
    return fontFamilyPropertyDefinition;
  }

  return {
    ...fontFamilyPropertyDefinition,
    description
  };
}

type FontFamilyToolProperty = {
  type: string;
  description: string;
  enum?: readonly string[];
};

/** Tool parameter definitions for a prefixed font family pair. */
export function fontFamilyPropertyPair(
  prefix = "",
  familyDescription?: string
): Record<string, FontFamilyToolProperty> {
  const familyKey = prefix ? `${prefix}FontFamily` : "fontFamily";
  const typeKey = prefix ? `${prefix}FontFamilyType` : "fontFamilyType";

  return {
    [familyKey]: fontFamilyProperty(familyDescription),
    [typeKey]: fontFamilyTypePropertyDefinition
  };
}

/** Zod schema fields for border color, style, width, and hover border. */
export const borderSchemaFields = {
  borderColorPalette: colorPalette,
  borderColorHex: hexColor,
  borderColorOpacity: opacity,
  borderStyle: borderStyleEnum.optional(),
  borderWidth: z.number().min(0).optional(),
  hoverBorderColorPalette: colorPalette,
  hoverBorderColorHex: hexColor,
  hoverBorderColorOpacity: opacity,
  hoverBorderStyle: borderStyleEnum.optional(),
  hoverBorderWidth: z.number().min(0).optional()
};

export const borderPropertyDefinitions = {
  borderColorPalette: {
    type: "string",
    description:
      "REQUIRED for custom border colors. Set to '' (empty string) when using borderColorHex."
  },
  borderColorHex: {
    type: "string",
    description:
      "Border color hex. MUST be paired with borderColorPalette: '' to work."
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
  // Hover - border
  hoverBorderColorPalette: {
    type: "string",
    description:
      "Set to '' when using hoverBorderColorHex. For palette colors use 'color1'-'color8'."
  },
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
  hoverBorderStyle: {
    type: "string",
    enum: ["solid", "dashed", "dotted", "none"],
    description: "Border line style on hover"
  },
  hoverBorderWidth: {
    type: "number",
    description: "Border width on hover in pixels",
    minimum: 0
  }
} as const;
