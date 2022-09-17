import {
  cssStyleDisplayBlock,
  cssStyleDisplayNone
} from "visual/utils/cssStyle";
import { defaultValueValue } from "../onChange";
import { CSSValue } from "../style2/types";

export function cssStyleBgMediaMap({ v, device }: CSSValue): string {
  const dvv = (key: string): unknown => defaultValueValue({ v, key, device });
  const displayState = dvv("media");

  return displayState === "map"
    ? cssStyleDisplayBlock()
    : cssStyleDisplayNone();
}
