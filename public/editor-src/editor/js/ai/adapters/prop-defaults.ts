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

/** Normalize every fontFamily value present in props (any prefix). */
export function withAllFontFamilyNormalize<T extends Record<string, unknown>>(
  props: T
): T {
  let result = props;

  for (const key of Object.keys(props)) {
    if (!fontFamilyKeyRe.test(key)) {
      continue;
    }

    const prefix =
      key === "fontFamily" ? "" : key.replace(/FontFamily$/i, "");
    result = withFontFamilyNormalize(result, prefix);
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
  { hex: "hoverGradientColorHex", palette: "hoverGradientColorPalette" },
  { hex: "boxShadowColorHex", palette: "boxShadowColorPalette" },
  { hex: "hoverBoxShadowColorHex", palette: "hoverBoxShadowColorPalette" },
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

const GRADIENT_KEYS = [
  "gradientColorHex",
  "gradientColorOpacity",
  "gradientColorPalette",
  "gradientType",
  "gradientLinearDegree",
  "gradientRadialDegree",
  "gradientStartPointer",
  "gradientFinishPointer"
];

const HOVER_GRADIENT_KEYS = [
  "hoverGradientColorHex",
  "hoverGradientColorOpacity",
  "hoverGradientColorPalette",
  "hoverGradientType",
  "hoverGradientLinearDegree",
  "hoverGradientRadialDegree",
  "hoverGradientStartPointer",
  "hoverGradientFinishPointer"
];

export function inferBgColorType<T extends Record<string, unknown>>(
  props: T
): T {
  const result = { ...props } as Record<string, unknown>;

  if (!("bgColorType" in result)) {
    if ("gradientSpeed" in result && result.gradientSpeed !== undefined) {
      result.bgColorType = "animated-gradient";
    } else if (
      GRADIENT_KEYS.some((k) => k in result && result[k] !== undefined)
    ) {
      result.bgColorType = "gradient";
    }
  }

  if (!("hoverBgColorType" in result)) {
    if (
      "hoverGradientSpeed" in result &&
      result.hoverGradientSpeed !== undefined
    ) {
      result.hoverBgColorType = "animated-gradient";
    } else if (
      HOVER_GRADIENT_KEYS.some((k) => k in result && result[k] !== undefined)
    ) {
      result.hoverBgColorType = "gradient";
    }
  }

  return result as T;
}

type GradientStop = {
  position: number;
  hex: string;
  opacity: number;
  palette: string;
};

export function withAnimatedGradientDefaults<T extends Record<string, unknown>>(
  props: T
): T {
  const result = { ...props } as Record<string, unknown>;

  if (result.bgColorType === "animated-gradient" && !result.gradientStops) {
    const stops: GradientStop[] = [
      {
        position: (result.gradientStartPointer as number) ?? 0,
        hex: (result.bgColorHex as string) ?? "#000000",
        opacity: (result.bgColorOpacity as number) ?? 1,
        palette: (result.bgColorPalette as string) ?? ""
      },
      {
        position: (result.gradientFinishPointer as number) ?? 100,
        hex: (result.gradientColorHex as string) ?? "#FFFFFF",
        opacity: (result.gradientColorOpacity as number) ?? 1,
        palette: (result.gradientColorPalette as string) ?? ""
      }
    ];
    result.gradientStops = stops;
    result.activeStopIndex = 0;
    if (!("gradientSpeed" in result)) {
      result.gradientSpeed = 5;
    }
  }

  if (
    result.hoverBgColorType === "animated-gradient" &&
    !result.hoverGradientStops
  ) {
    const stops: GradientStop[] = [
      {
        position: (result.hoverGradientStartPointer as number) ?? 0,
        hex: (result.hoverBgColorHex as string) ?? "#000000",
        opacity: (result.hoverBgColorOpacity as number) ?? 1,
        palette: (result.hoverBgColorPalette as string) ?? ""
      },
      {
        position: (result.hoverGradientFinishPointer as number) ?? 100,
        hex: (result.hoverGradientColorHex as string) ?? "#FFFFFF",
        opacity: (result.hoverGradientColorOpacity as number) ?? 1,
        palette: (result.hoverGradientColorPalette as string) ?? ""
      }
    ];
    result.hoverGradientStops = stops;
    result.hoverActiveStopIndex = 0;
    if (!("hoverGradientSpeed" in result)) {
      result.hoverGradientSpeed = 5;
    }
  }

  return result as T;
}

type Props = Record<string, unknown>;

const PADDING_SIDES = [
  "paddingTop",
  "paddingRight",
  "paddingBottom",
  "paddingLeft"
] as const;

const BORDER_RADIUS_SIDES = [
  "borderTopLeftRadius",
  "borderTopRightRadius",
  "borderBottomRightRadius",
  "borderBottomLeftRadius"
] as const;

export const inferPaddingType = <T extends Props>(props: T): T => {
  if ("paddingType" in props) {
    return props;
  }

  const hasPaddingSide = PADDING_SIDES.some(
    (side) => side in props && props[side] !== undefined
  );

  if (!hasPaddingSide) {
    return props;
  }

  const allSidesMatchTop =
    "paddingTop" in props &&
    PADDING_SIDES.every(
      (side) => side in props && props[side] === props.paddingTop
    );

  return { ...props, paddingType: allSidesMatchTop ? "grouped" : "ungrouped" };
};

export const inferBorderRadiusType = <T extends Props>(props: T): T => {
  if ("borderRadiusType" in props) {
    return props;
  }

  const hasPerCornerRadius = BORDER_RADIUS_SIDES.some(
    (side) => side in props && props[side] !== undefined
  );

  if (hasPerCornerRadius) {
    return { ...props, borderRadiusType: "ungrouped" };
  }

  if ("borderRadius" in props && props.borderRadius !== undefined) {
    return { ...props, borderRadiusType: "grouped" };
  }

  return props;
};
