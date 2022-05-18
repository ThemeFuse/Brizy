import { styleBgGradient } from "visual/utils/style2";

export function cssStyleBgGradient({ v, device, state, prefix }) {
  const bgGradient = styleBgGradient({
    v,
    device,
    state,
    prefix
  });
  return `background-image:${bgGradient};`;
}

export function cssStyleBgGradientImportant({ v, device, state }) {
  const bgGradient = styleBgGradient({
    v,
    device,
    state
  });
  return `background-image:${bgGradient}!important;`;
}
