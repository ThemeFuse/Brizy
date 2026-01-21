import { getColor } from "visual/utils/color";
import { CSSStyleFn } from "visual/utils/cssStyle/types";
import { normalizeGradientStops } from "visual/utils/style2/styleBgGradient";
import { styleAnimatedGradient } from "visual/utils/style2/utils";

export const css: CSSStyleFn<"backgroundColor"> = ({
  meta,
  value,
  config
}): string => {
  const { isDisabled } = meta ?? {};

  if (isDisabled) {
    return "background-color: transparent;";
  }

  const {
    isSolid,
    isGradient,
    isLinearGradient,
    isRadialGradient,
    isAnimatedGradient
  } = meta ?? {};

  const {
    hex,
    opacity,
    palette,
    gradientHex,
    gradientOpacity,
    gradientPalette,
    start,
    end,
    linearDegree,
    radialDegree,
    gradientSpeed = 1,
    gradientStops = []
  } = value;

  const backgroundColor = getColor(palette, hex, opacity, config);

  if (isSolid) {
    return `background-color:${backgroundColor}; background-image:none;`;
  }

  if (isGradient) {
    const gradientColor = getColor(
      gradientPalette,
      gradientHex,
      gradientOpacity,
      config
    );

    if (isLinearGradient) {
      return `background-image: linear-gradient(${linearDegree}deg, ${backgroundColor} ${start}%, ${gradientColor} ${end}%);`;
    }

    if (isRadialGradient) {
      return `background-image: radial-gradient(circle ${radialDegree}px, ${backgroundColor} ${start}%, ${gradientColor} ${end}%);`;
    }
  }

  if (isAnimatedGradient) {
    const gradient = styleAnimatedGradient(
      normalizeGradientStops(gradientStops, config),
      gradientSpeed,
      linearDegree
    );
    return `background-image: ${gradient};`;
  }

  return "";
};
