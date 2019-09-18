import { styleZIndex } from "visual/utils/style2";

export function cssStylePosition({ v, device, state }) {
  const zIndex = styleZIndex({ v, device, state });

  return zIndex === undefined
    ? ""
    : zIndex === 0
    ? "position:static;"
    : "position:relative;";
}

export function cssStylePositionMode({ v, device, state }) {
  const zIndex = cssStylePosition({ v, device, state });
  return IS_EDITOR ? "position:relative;" : zIndex;
}
