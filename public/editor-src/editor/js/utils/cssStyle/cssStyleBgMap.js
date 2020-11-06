import { styleMediaBg } from "visual/utils/style2";

export function cssStyleBgMediaMap({ v, device }) {
  const displayState = styleMediaBg({ v, device }) === "map" ? "block" : "none";
  return `display: ${displayState};`;
}
