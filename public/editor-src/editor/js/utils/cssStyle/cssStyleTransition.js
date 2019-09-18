import { styleHoverTransition } from "visual/utils/style2";

export function cssStyleHoverTransition({ v, device, state }) {
  const hoverTransition = styleHoverTransition({ v, device, state });

  return hoverTransition === undefined
    ? ""
    : `transition-duration:0.${hoverTransition}s;`;
}

export function cssStylePropertyHoverTransition() {
  return `transition-property:box-shadow, background, border-radius, border-color;`;
}
