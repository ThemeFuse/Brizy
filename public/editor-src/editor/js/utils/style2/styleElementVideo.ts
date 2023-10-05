import { getImageUrl } from "visual/utils/image";
import { defaultValueValue } from "visual/utils/onChange";
import { CSSValue } from "./types";

export function styleElementVideoPaddingRatio({
  v,
  device,
  state
}: CSSValue): string {
  const dvv = (key: string) => defaultValueValue({ v, key, device, state });
  const ratio:
    | "1:1"
    | "2:1"
    | "2:3"
    | "3:4"
    | "3:2"
    | "4:3"
    | "9:16"
    | "16:9"
    | "21:9" = dvv("ratio");

  const paddingRatio = {
    "1:1": "100%",
    "2:1": "50%",
    "2:3": "150%",
    "3:4": "125%",
    "3:2": "66.67%",
    "4:3": "75%",
    "9:16": "177.78%",
    "16:9": "56.25%",
    "21:9": "42.86%"
  };

  return ratio === undefined ? ratio : paddingRatio[ratio];
}

export function styleElementVideoIconFontSize({
  v,
  device,
  state
}: CSSValue): string {
  const dvv = (key: string) => defaultValueValue({ v, key, device, state });
  const iconSize = dvv("iconSize");

  const iconFontSize = Math.round(iconSize * 0.35);

  return iconSize === undefined ? iconSize : iconFontSize;
}

export function styleElementVideoCoverSrc({
  v,
  device,
  state
}: CSSValue): string | undefined {
  const dvv = (key: string) => defaultValueValue({ v, key, device, state });
  const src = dvv("coverImageSrc");
  const fileName = dvv("coverImageFileName");
  const sizeType = dvv("coverSizeType") ?? "custom";

  if (src === undefined) {
    return undefined;
  }

  if (src === "") {
    return "none";
  }

  return `url("${getImageUrl({ uid: src, fileName, sizeType })}")`;
}
