import { styleColor } from "visual/utils/style2";

export function cssStyleColor({ v, device, state }) {
  const color = styleColor({
    v,
    device,
    state
  });
  return color === undefined ? "" : `color:${color};`;
}
