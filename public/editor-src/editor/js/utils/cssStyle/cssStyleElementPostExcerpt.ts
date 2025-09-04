import { defaultValueValue } from "visual/utils/onChange";
import { CSSValue } from "visual/utils/style2/types";

export function cssStyleElementPostExcerptNumberOfLines({
  v,
  device,
  state
}: CSSValue): string {
  const dvv = (key: string): unknown =>
    defaultValueValue({ v, key, device, state });

  const numberOfLines = dvv("numberOfLines");

  return typeof numberOfLines === "number" && numberOfLines > 0
    ? `overflow: hidden;text-overflow: ellipsis;-webkit-line-clamp: ${numberOfLines};  -webkit-box-orient: vertical; display: -webkit-box;`
    : "";
}
