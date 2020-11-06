import { styleMediaBg } from "visual/utils/style2";
import { CSSValue } from "visual/utils/style2/types";

export function cssStyleBgMediaVideo({ v, device }: CSSValue): string {
  const display = styleMediaBg({ v, device }) === "video" ? "block" : "none";
  return `display: ${display};`;
}
