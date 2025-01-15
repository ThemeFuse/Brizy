import { SizeType } from "visual/global/Config/types/configs/common";
import { configSelector } from "visual/redux/selectors";
import { read as readString } from "visual/utils/string/specs";
import { getImageUrl } from "../image";
import { defaultValueValue } from "../onChange";
import { capByPrefix } from "../string";
import { CSSValue } from "./types";

export function styleMaskSize({
  maskSize,
  maskScale,
  maskScaleSuffix
}: {
  maskSize: string;
  maskScale: number;
  maskScaleSuffix: string;
}): string {
  switch (maskSize) {
    case "contain":
    case "cover":
      return `-webkit-mask-size:${maskSize};mask-size:${maskSize};`;
    case "custom":
      return `-webkit-mask-size:${maskScale}${maskScaleSuffix};mask-size:${maskScale}${maskScaleSuffix};`;
  }

  return "";
}

export function styleMaskPosition({
  maskPositionx,
  maskPositionxSuffix,
  maskPositiony,
  maskPositionySuffix,
  maskPosition
}: {
  maskPositionx: number;
  maskPositionxSuffix: string;
  maskPositiony: number;
  maskPositionySuffix: string;
  maskPosition: string;
}) {
  const customPosition = `
    -webkit-mask-position-x:${maskPositionx}${maskPositionxSuffix};
    -webkit-mask-position-y:${maskPositiony}${maskPositionySuffix};
    mask-position-x:${maskPositionx}${maskPositionxSuffix};
    mask-position-y:${maskPositiony}${maskPositionySuffix};
  `;

  switch (maskPosition) {
    case "center center":
    case "center left":
    case "center right":
    case "top center":
    case "top right":
    case "top left":
    case "bottom center":
    case "bottom left":
    case "bottom right":
      return `-webkit-mask-position:${maskPosition};mask-position:${maskPosition};`;
    case "custom":
      return customPosition;
  }

  return "";
}

export function styleMaskCustomShape({
  v,
  device,
  state,
  prefix = "",
  store
}: CSSValue): string {
  const dvv = (key: string): unknown =>
    defaultValueValue({ v, key, device, state });
  const config = configSelector(store.getState());

  const src = readString(dvv(capByPrefix(prefix, "maskCustomUploadImageSrc")));
  const fileName = readString(
    dvv(capByPrefix(prefix, "maskCustomUploadImageFileName"))
  );
  const extension = readString(
    dvv(capByPrefix(prefix, "maskCustomUploadImageExtension"))
  );

  if ((extension === "png" || extension === "svg") && src) {
    const url = getImageUrl(
      {
        fileName,
        uid: src,
        sizeType: SizeType.custom
      },
      config
    );

    if (!url) {
      return "";
    }
    return `-webkit-mask-image:  url("${url}");`;
  }
  return "";
}
