import { styleBgGradient } from "visual/utils/style2";
import { CSSValue } from "../style2/types";

export function cssStyleBgGradient({
  v,
  device,
  state,
  store,
  getConfig,
  prefix
}: CSSValue): string {
  const bgGradient = styleBgGradient({
    v,
    device,
    state,
    store,
    getConfig,
    prefix
  });
  return `background-image:${bgGradient};`;
}
