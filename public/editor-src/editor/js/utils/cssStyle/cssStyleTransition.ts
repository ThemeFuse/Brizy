import { defaultValueValue } from "visual/utils/onChange";
import { CSSValue } from "visual/utils/style2/types";
import { capByPrefix } from "../string";

export function cssStyleHoverTransition({
  v,
  device,
  state,
  prefix = ""
}: CSSValue): string {
  const dvv = (key: string) => defaultValueValue({ v, key, device, state });
  const hoverTransition = dvv(capByPrefix(prefix, "hoverTransition"));

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

export function cssStyleHoverTransitionFlash({
  v,
  device,
  state,
  prefix = ""
}: CSSValue): string {
  const dvv = (key: string) => defaultValueValue({ v, key, device, state });
  const dvvHover = (key: string) =>
    defaultValueValue({ v, key, device, state: "hover" });
  const hoverTransition = dvv("hoverTransition");

  const bgColorType = dvv(capByPrefix(prefix, "bgColorType"));
  const bgColorTypeHover = dvvHover(capByPrefix(prefix, "bgColorType"));

  const bgType =
    (bgColorType === "solid" && bgColorTypeHover === "gradient") ||
    (bgColorType === "gradient" && bgColorTypeHover === "solid");

  return hoverTransition === undefined
    ? ""
    : bgType
    ? "transition-duration:0s; transition-property:opacity;"
    : `transition-duration:0.${hoverTransition}s;`;
}
