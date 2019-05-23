import { styleColor } from "visual/utils/style2";

export function cssStyleColor({ v, device, state }) {
  return `color:${styleColor({
    v,
    device,
    state
  })};`;
}
