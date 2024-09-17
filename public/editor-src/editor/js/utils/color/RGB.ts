import { isNullish, MValue } from "visual/utils/value";
import { isHex } from "visual/utils/color";

export interface RGB {
  r: number;
  g: number;
  b: number;
}

export type RGBA = RGB & { a: number };

export const getRGBValues = (_hex: string): MValue<RGB> => {
  if (isHex(_hex)) {
    const hex = _hex.replace("#", "");
    return {
      r: parseInt(hex.substring(0, 2), 16),
      g: parseInt(hex.substring(2, 4), 16),
      b: parseInt(hex.substring(4, 6), 16)
    };
  }

  return undefined;
};

export function hexToBlendedRgba({
  hex,
  opacity
}: {
  hex: MValue<string>;
  opacity: MValue<number>;
}): MValue<string> {
  if (isNullish(hex) || isNullish(opacity)) return undefined;

  const rgb = getRGBValues(hex);

  if (!rgb) {
    return undefined;
  }

  const { r, g, b } = rgb;

  const newR = Math.round(r * opacity + 255 * (1 - opacity));
  const newG = Math.round(g * opacity + 255 * (1 - opacity));
  const newB = Math.round(b * opacity + 255 * (1 - opacity));

  // Converts a hex color with any opacity value to an RGBA color with 100% opacity
  return `rgba(${newR}, ${newG}, ${newB}, 1)`;
}
