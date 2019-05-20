import { styleBorderRadius } from "visual/utils/style2";

export function cssStyleBorderRadiusGrouped({ v, device, state }) {
  return `border-radius:${styleBorderRadius({
    v,
    device,
    state,
  })};`;
}
