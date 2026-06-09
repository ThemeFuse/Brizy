import { tripId } from "visual/utils/fonts/transform";
import type { HandlerDeps } from "./types";

const fontFamilyKeyRe = /^(?:.+F|f)ontFamily$/;

/**
 * Validate that every fontFamily value in parsed data exists in project fonts.
 * Matches keys: "fontFamily", "staticFontFamily", "animatedFontFamily",
 * "typographyFontFamily", etc.
 */
export function validateFonts(
  deps: HandlerDeps,
  parsed: Record<string, unknown>
): { success: false; error: string } | null {
  for (const key of Object.keys(parsed)) {
    if (!fontFamilyKeyRe.test(key)) continue;

    const value = parsed[key];
    if (
      typeof value === "string" &&
      !deps.projectRepository.fontExists(value)
    ) {
      return {
        success: false,
        error: `Font "${value}" not found in project fonts. Use getProjectFonts to see available fonts, or addFont to add it first.`
      };
    }
  }

  return null;
}

/**
 * Normalize fontFamily values to builder format (lowercase, underscores).
 * When fontFamily is set, auto-clears fontStyle to "" so the custom font takes effect.
 *
 * Supports prefixed variants (e.g. "typographyFontFamily", "staticFontFamily").
 */
export function withFontFamilyNormalize<T extends Record<string, unknown>>(
  props: T,
  prefix = ""
): T {
  const familyKey = prefix ? `${prefix}FontFamily` : "fontFamily";
  const styleKey = prefix ? `${prefix}FontStyle` : "fontStyle";
  const raw = props[familyKey];

  if (typeof raw !== "string") return props;

  const result = { ...props, [familyKey]: tripId(raw) };

  if (!(styleKey in result)) {
    (result as Record<string, unknown>)[styleKey] = "";
  }

  return result;
}

/**
 * Color hex to palette mapping.
 * When LLM provides hex without palette, we auto-clear the palette.
 */
const COLOR_DEFAULTS: Array<{ hex: string; palette: string }> = [
  { hex: "bgColorHex", palette: "bgColorPalette" },
  { hex: "colorHex", palette: "colorPalette" },
  { hex: "borderColorHex", palette: "borderColorPalette" },
  { hex: "hoverBgColorHex", palette: "hoverBgColorPalette" },
  { hex: "hoverColorHex", palette: "hoverColorPalette" },
  { hex: "hoverBorderColorHex", palette: "hoverBorderColorPalette" },
  { hex: "gradientColorHex", palette: "gradientColorPalette" },
  { hex: "boxShadowColorHex", palette: "boxShadowColorPalette" },
  { hex: "activeColorHex", palette: "activeColorPalette" },
  { hex: "activeBgColorHex", palette: "activeBgColorPalette" },
  { hex: "backBgColorHex", palette: "backBgColorPalette" },
  { hex: "thumbArrowColorHex", palette: "thumbArrowColorPalette" },
  { hex: "thumbArrowBgColorHex", palette: "thumbArrowBgColorPalette" },
  { hex: "iconColorHex", palette: "iconColorPalette" },
  { hex: "arrowsColorHex", palette: "arrowsColorPalette" },
  { hex: "textColorHex", palette: "textColorPalette" },
  { hex: "linkColorHex", palette: "linkColorPalette" },
  { hex: "lostColorHex", palette: "lostColorPalette" },
  { hex: "labelColorHex", palette: "labelColorPalette" },
  { hex: "registerInfoColorHex", palette: "registerInfoColorPalette" },
  { hex: "registerLinkColorHex", palette: "registerLinkColorPalette" },
  { hex: "loginLinkColorHex", palette: "loginLinkColorPalette" },
  { hex: "checkboxColorHex", palette: "checkboxColorPalette" },
  { hex: "agreementColorHex", palette: "agreementColorPalette" },
  { hex: "titleColorHex", palette: "titleColorPalette" },
  { hex: "hoverTitleColorHex", palette: "hoverTitleColorPalette" },
  { hex: "titleTextShadowColorHex", palette: "titleTextShadowColorPalette" },
  {
    hex: "hoverTitleTextShadowColorHex",
    palette: "hoverTitleTextShadowColorPalette"
  },
  {
    hex: "chartPieItemsGoogleColorHex",
    palette: "chartPieItemsGoogleColorPalette"
  },
  {
    hex: "chartPieItemsFacebookColorHex",
    palette: "chartPieItemsFacebookColorPalette"
  },
  {
    hex: "chartPieItemsTwitterColorHex",
    palette: "chartPieItemsTwitterColorPalette"
  },

  {
    hex: "chartBarItemsGoogleColorHex",
    palette: "chartBarItemsGoogleColorPalette"
  },
  {
    hex: "chartBarItemsFacebookColorHex",
    palette: "chartBarItemsFacebookColorPalette"
  },
  {
    hex: "chartBarItemsTwitterColorHex",
    palette: "chartBarItemsTwitterColorPalette"
  },

  {
    hex: "chartLineItemsGoogleColorHex",
    palette: "chartLineItemsGoogleColorPalette"
  },
  {
    hex: "chartLineItemsFacebookColorHex",
    palette: "chartLineItemsFacebookColorPalette"
  },
  {
    hex: "chartLineItemsTwitterColorHex",
    palette: "chartLineItemsTwitterColorPalette"
  }
];

/**
 * Merges default palette values when LLM provides hex colors without clearing palette.
 * This ensures custom colors work even if LLM forgets to set palette to "".
 */
export function withColorDefaults<T extends Record<string, unknown>>(
  props: T
): T {
  const result = { ...props };

  for (const { hex, palette } of COLOR_DEFAULTS) {
    if (hex in result && result[hex] !== undefined && !(palette in result)) {
      (result as Record<string, unknown>)[palette] = "";
    }
  }

  return result;
}
