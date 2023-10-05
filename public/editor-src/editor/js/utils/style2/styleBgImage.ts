import { getImageUrl } from "visual/utils/image";
import { defaultValueValue } from "visual/utils/onChange";
import { styleState } from "visual/utils/style";
import { CSSValue } from "./types";

export function styleBgImage({ v, device, state }: CSSValue): string {
  const isHover = styleState({ v, state });
  const dvv = (key: string) => defaultValueValue({ v, key, device, state });
  const dvvHover = (key: string) =>
    defaultValueValue({ v, key, device, state: "hover" });

  const media = dvv("media");
  const bgImageSrc = dvv("bgImageSrc");
  const bgSizeType = dvv("bgSizeType");

  const bgPopulation = dvv("bgPopulation");
  const hoverMedia = dvvHover("media");
  const hoverBgImageSrc = dvvHover("bgImageSrc");
  const hoverBgPopulation = dvvHover("bgPopulation");

  const bgImageFileName = dvv("bgImageFileName");
  const hoverBgImageFileName = dvvHover("bgImageFileName");

  const hover =
    hoverMedia === "image" && (hoverBgImageSrc !== "" || hoverBgPopulation)
      ? hoverBgPopulation
        ? `var(--brz-background-image)`
        : `url("${getImageUrl({
            uid: hoverBgImageSrc,
            fileName: hoverBgImageFileName,
            sizeType: bgSizeType
          })}")`
      : "none";

  const normal =
    media === "image" && (bgImageSrc !== "" || bgPopulation)
      ? bgPopulation
        ? `var(--brz-background-image)`
        : `url("${getImageUrl({
            uid: bgImageSrc,
            fileName: bgImageFileName,
            sizeType: bgSizeType
          })}")`
      : "none";

  return isHover === "hover" ? hover : normal;
}

export function styleExportBgImage({ v, device, state }: CSSValue): string {
  const dvv = (key: string) => defaultValueValue({ v, key, device, state });

  const media = dvv("media");
  const bgImageSrc = dvv("bgImageSrc");
  const bgSizeType = dvv("bgSizeType");
  const bgPopulation = dvv("bgPopulation");
  const bgImageFileName = dvv("bgImageFileName");

  return media === "image" && (bgImageSrc !== "" || bgPopulation)
    ? bgPopulation
      ? `var(--brz-background-image)`
      : `url("${getImageUrl({
          sizeType: bgSizeType,
          uid: bgImageSrc,
          fileName: bgImageFileName
        })}")`
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
    : !bgPopulation
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
    : !bgPopulation
    ? `${bgPositionY}%`
    : "0%";
}
