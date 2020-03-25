import { styleZIndex } from "visual/utils/style2";

export function cssStylePosition({ v, device, state }) {
  const zIndex = styleZIndex({ v, device, state });

  return zIndex === 0 ? "position:static;" : "position:relative;";
}

export function cssStylePositionMode() {
  return "position:relative;";
}
