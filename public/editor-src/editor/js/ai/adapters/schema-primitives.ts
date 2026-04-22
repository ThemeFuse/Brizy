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
