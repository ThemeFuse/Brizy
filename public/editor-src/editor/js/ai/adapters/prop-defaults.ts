import { tripId } from "visual/utils/fonts/transform";
import {
  defaultValueValue,
  parseDefaultValueKey,
  tempValueKey
} from "visual/utils/onChange/device";
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

    const prefix = key === "fontFamily" ? "" : key.replace(/FontFamily$/i, "");
    result = withFontFamilyNormalize(result, prefix);
  }

  return result;
}

/**
 * Clear the palette slot whenever a hex colour is sent without one.
 *
 * A stored colour is a pair — `<name>ColorHex` and `<name>ColorPalette` — and
 * the palette slot wins while it holds a slot id, so a hex sent on its own
 * would be stored and never painted. The pairing is derived from the key
 * rather than listed: every colour in the builder is spelled this way, and the
 * list this replaced had to be extended by hand for each new element, which is
 * a silent failure when it is forgotten (the call succeeds and the colour does
 * not change). `restoreColorOpacity` below reads the pair the same way.
 */
const paletteKeyFor = (key: string): string | undefined => {
  const match = key.match(/^(.*[Cc]olor)Hex$/);
  return match ? `${match[1]}Palette` : undefined;
};

export function withColorDefaults<T extends Record<string, unknown>>(
  props: T
): T {
  const result: Record<string, unknown> = { ...props };

  for (const key of Object.keys(props)) {
    const palette = paletteKeyFor(key);
    if (palette === undefined || result[key] === undefined) continue;
    if (palette in result) continue;

    result[palette] = "";
  }

  return result as T;
}

/**
 * Restore a color's opacity when a *ColorHex is applied to a stored
 * fully-transparent color, mirroring the toolbar's setHex rule
 * (utils/options/ColorPicker/model: opacity = current || tempOpacity || 1).
 * AI update tools send a hex without an opacity, so a stored *ColorOpacity of 0
 * — the default for most background colors — would keep the change invisible.
 *
 * Stateful: needs the element's stored value, so callers pass it in (via a
 * beforeUpdate hook). Only fills the gap — an explicit opacity in `changes`, or
 * a non-zero stored opacity, is left untouched, so a legitimately semi-
 * transparent color is never clobbered by a hex-only edit.
 *
 * The stored opacity is read the way the editor paints it, through
 * `defaultValueValue`: a tablet or mobile colour with no opacity of its own
 * paints with the desktop one. Looking only at the device key would find
 * nothing on almost every element and force a deliberately translucent
 * desktop colour to solid on that device.
 */
export function restoreColorOpacity(
  stored: Record<string, unknown>,
  changes: Record<string, unknown>
): Record<string, unknown> {
  const result: Record<string, unknown> = { ...changes };

  for (const key of Object.keys(changes)) {
    const match = key.match(/^(.*[Cc]olor)Hex$/);
    if (!match || !changes[key]) continue;

    const opacityKey = `${match[1]}Opacity`;
    if (opacityKey in changes) continue; // caller set opacity explicitly

    const { key: opacity, device, state } = parseDefaultValueKey(opacityKey);
    const painted = (valueKey: string): number | undefined => {
      const value = defaultValueValue({
        v: stored,
        key: valueKey,
        device,
        state
      });
      return typeof value === "number" ? value : undefined;
    };

    const current = painted(opacity);
    if (current !== undefined && current !== 0) continue; // already visible

    const temp = painted(tempValueKey(opacity));
    result[opacityKey] = temp !== undefined && temp !== 0 ? temp : 1;
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
