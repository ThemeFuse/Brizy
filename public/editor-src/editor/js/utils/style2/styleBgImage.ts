import {
  getImageSize,
  isOriginalSize,
  isPredefinedSize
} from "visual/editorComponents/Image/utils";
import {
  imagePopulationUrl,
  imageSpecificSize,
  imageUrl,
  svgUrl
} from "visual/utils/image";
import { defaultValueValue } from "visual/utils/onChange";
import { styleState } from "visual/utils/style";
import { CSSValue } from "./types";

const isSVG = (extension: string): extension is "svg" => extension === "svg";

export function styleBgImage({ v, device, state }: CSSValue): string {
  const isHover = styleState({ v, state });
  const dvv = (key: string) => defaultValueValue({ v, key, device, state });
  const dvvHover = (key: string) =>
    defaultValueValue({ v, key, device, state: "hover" });

  const media = dvv("media");
  const bgImageSrc = dvv("bgImageSrc");
  const bgSizeType = dvv("bgSizeType");
  const bgSize = getImageSize(bgSizeType);
  const bgImageExtension = dvv("bgImageExtension");

  const bgPopulation = dvv("bgPopulation");
  const hoverMedia = dvvHover("media");
  const hoverBgImageSrc = dvvHover("bgImageSrc");
  const hoverBgImageExtension = dvvHover("bgImageExtension");
  const hoverBgPopulation = dvvHover("bgPopulation");

  const bgImageFileName = dvv("bgImageFileName");
  const hoverBgImageFileName = dvvHover("bgImageFileName");

  if (isPredefinedSize(bgSize) || isOriginalSize(bgSize)) {
    return `url(${imageSpecificSize(bgImageSrc, {
      size: bgSizeType,
      fileName: bgImageFileName
    })})`;
  }

  const hover =
    hoverMedia === "image" && hoverBgImageSrc !== "" && !hoverBgPopulation
      ? `url(${
          isSVG(hoverBgImageExtension)
            ? svgUrl(hoverBgImageSrc, { fileName: hoverBgImageFileName })
            : imageUrl(hoverBgImageSrc, { fileName: hoverBgImageFileName })
        })`
      : "none";

  const normal =
    media === "image" && bgImageSrc !== "" && bgPopulation === ""
      ? `url(${
          isSVG(bgImageExtension)
            ? svgUrl(bgImageSrc, { fileName: bgImageFileName })
            : imageUrl(bgImageSrc, { fileName: bgImageFileName })
        })`
      : "none";
  return isHover === "hover" ? hover : normal;
}
export function styleExportBgImage({ v, device, state }: CSSValue): string {
  const dvv = (key: string) => defaultValueValue({ v, key, device, state });

  const media = dvv("media");
  const bgImageSrc = dvv("bgImageSrc");
  const bgImageExtension = dvv("bgImageExtension");
  const bgPopulation = dvv("bgPopulation");

  const bgImageFileName = dvv("bgImageFileName");

  const bgImage = bgPopulation
    ? imagePopulationUrl(bgPopulation)
    : isSVG(bgImageExtension)
    ? svgUrl(bgImageSrc, { fileName: bgImageFileName })
    : imageUrl(bgImageSrc, { fileName: bgImageFileName });
  return media === "image" && (bgImageSrc !== "" || bgPopulation !== "")
    ? `url(${bgImage})`
    : "none";
}

export function styleBgPositionX({ v, device, state }: CSSValue): string {
  const isHover = styleState({ v, state });

  const dvv = (key: string) => defaultValueValue({ v, key, device, state });
  const dvvHover = (key: string) =>
    defaultValueValue({ v, key, device, state: "hover" });

  const bgPopulation = dvv("bgPopulation");
  const bgPositionX = dvv("bgPositionX");

  const hoverBgPopulation = dvvHover("bgPopulation");
  const hoverBgPositionX = dvvHover("bgPositionX");
  return isHover === "hover" && !hoverBgPopulation
    ? `${hoverBgPositionX}%`
    : bgPopulation === ""
    ? `${bgPositionX}%`
    : "0%";
}

export function styleBgPositionY({ v, device, state }: CSSValue): string {
  const isHover = styleState({ v, state });

  const dvv = (key: string) => defaultValueValue({ v, key, device, state });
  const dvvHover = (key: string) =>
    defaultValueValue({ v, key, device, state: "hover" });

  const bgPopulation = dvv("bgPopulation");
  const bgPositionY = dvv("bgPositionY");

  const hoverBgPopulation = dvvHover("bgPopulation");
  const hoverBgPositionY = dvvHover("bgPositionY");
  return isHover === "hover" && !hoverBgPopulation
    ? `${hoverBgPositionY}%`
    : bgPopulation === ""
    ? `${bgPositionY}%`
    : "0%";
}
