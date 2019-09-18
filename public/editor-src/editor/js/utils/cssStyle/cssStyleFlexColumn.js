import { styleSizeWidth } from "visual/utils/style2";

export function cssStyleFlexColumn({ v, device, state }) {
  const width = styleSizeWidth({ v, device, state });

  return width > 0 ? `flex:1 1 ${width}%;` : "";
}
