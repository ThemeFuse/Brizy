import { styleIconSpacing } from "visual/utils/style2";

export function cssStyleIconSpacing({ v, device, state }) {
  return `margin-right: ${styleIconSpacing({
    v,
    device,
    state
  })}px;`;
}
