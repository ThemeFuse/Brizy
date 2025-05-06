import { getImageUrl } from "visual/utils/image";
import { defaultValueValue } from "visual/utils/onChange";
import { CSSValue } from "./types";

export function styleElementVideoRatio({ v, device, state }: CSSValue): string {
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

  const types = {
    "1:1": "1/1",
    "2:1": "2/1",
    "2:3": "2/3",
    "3:4": "3/4",
    "3:2": "3/2",
    "4:3": "4/3",
    "9:16": "9/16",
    "16:9": "16/9",
    "21:9": "21/9"
  };

  return ratio === undefined ? ratio : types[ratio];
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
  state,
  getConfig
}: CSSValue): string | undefined {
  const dvv = (key: string) => defaultValueValue({ v, key, device, state });
  const config = getConfig();

  const src = dvv("coverImageSrc");
  const fileName = dvv("coverImageFileName");
  const sizeType = dvv("coverSizeType") ?? "custom";
  if (src === undefined) {
    return undefined;
  }

  if (src === "") {
    return "none";
  }

  return `url("${getImageUrl({ uid: src, fileName, sizeType }, config)}")`;
}
