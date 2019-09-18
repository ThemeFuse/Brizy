import { styleBgGradient } from "visual/utils/style2";

export function cssStyleBgGradient({ v, device, state }) {
  const bgGradient = styleBgGradient({
    v,
    device,
    state
  });
  return `background-image:${bgGradient};`;
}
