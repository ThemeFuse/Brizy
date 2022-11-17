import { defaultValueValue } from "visual/utils/onChange";
import { CSSValue } from "visual/utils/style2/types";

export function cssStyleHoverTransition({
  v,
  device,
  state
}: CSSValue): string {
  const dvv = (key: string) => defaultValueValue({ v, key, device, state });
  const hoverTransition = dvv("hoverTransition");

  return hoverTransition === undefined
    ? ""
    : `transition-duration:0.${hoverTransition}s;`;
}

export function cssStylePropertyHoverTransition(): string {
  return "transition-property: filter, box-shadow, background, border-radius, border-color;";
}

export function cssStylePropertyHoverTransitionColor(): string {
  return "transition-property: filter, color, background, border-color, box-shadow;";
}

export function cssStylePropertyHoverTransitionTransform(): string {
  return "transition-property: filter, color, background, border-color, box-shadow, transform;";
}
export function cssStylePropertyHoverTransitionFill(): string {
  return "transition-property: color, fill, stroke, background, border-color, box-shadow;";
}

export function cssStylePropertyHoverTransitionBoxShadow(): string {
  return "transition-property: border, box-shadow;";
}
