import {
  cssStyleDisplayBlock,
  cssStyleDisplayNone
} from "visual/utils/cssStyle";
import { CSSValue } from "visual/utils/style2/types";
import { defaultValueValue } from "../onChange";

export function cssStyleBgMediaVideo({ v, device }: CSSValue): string {
  const dvv = (key: string): unknown => defaultValueValue({ v, key, device });
  const display = dvv("media");

  return display === "video" ? cssStyleDisplayBlock() : cssStyleDisplayNone();
}
