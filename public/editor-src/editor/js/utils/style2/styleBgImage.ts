import { defaultCrop } from "visual/global/Config/types/configs/common";
import { getImageUrl } from "visual/utils/image";
import {
  UNSPLASH_BG_IMAGE_WIDTH,
  isUnsplashImage
} from "visual/utils/image/utils";
import { defaultValueValue } from "visual/utils/onChange";
import { camelCase, capByPrefix } from "visual/utils/string";
import { styleState } from "visual/utils/style";
import { CSSValue } from "./types";

export function styleBgImage({
  v,
  device,
  state,
  getConfig,
  prefix = ""
}: CSSValue): string {
  const isHover = styleState({ v, state });
  const dvv = (key: string) => defaultValueValue({ v, key, device, state });
  const dvvHover = (key: string) =>
    defaultValueValue({ v, key, device, state: "hover" });
  const config = getConfig();

  const media = dvv("media");
  const bgImageSrc = dvv(capByPrefix(prefix, "bgImageSrc"));
  const bgSizeType = dvv(capByPrefix(prefix, "bgSizeType"));

  const bgPopulation = dvv(capByPrefix(prefix, "bgPopulation"));
  const hoverMedia = dvvHover("media");
  const hoverBgImageSrc = dvvHover(capByPrefix(prefix, "bgImageSrc"));
  const hoverBgPopulation = dvvHover(capByPrefix(prefix, "bgPopulation"));

  const bgImageFileName = dvv(capByPrefix(prefix, "bgImageFileName"));
  const hoverBgImageFileName = dvvHover(capByPrefix(prefix, "bgImageFileName"));

  const hoverBgImageType = dvvHover("bgImageType");
  const bgImageType = dvv("bgImageType");
  const crop = isUnsplashImage(bgImageType)
    ? { ...defaultCrop, cW: UNSPLASH_BG_IMAGE_WIDTH }
    : undefined;
  const hoverCrop = isUnsplashImage(hoverBgImageType)
    ? { ...defaultCrop, cW: UNSPLASH_BG_IMAGE_WIDTH }
    : undefined;

  const hover =
    hoverMedia === "image" && (hoverBgImageSrc !== "" || hoverBgPopulation)
      ? hoverBgPopulation
        ? `var(--brz-hoverBackground-image)`
        : `url("${getImageUrl(
            {
              uid: hoverBgImageSrc,
              fileName: hoverBgImageFileName,
              sizeType: bgSizeType,
              imageType: hoverBgImageType,
              crop: hoverCrop
            },
            config
          )}")`
      : "none";

  const devicePrefix = device === "desktop" ? "" : device;
  const hoverPrefix = device === "desktop" && state === "hover" ? "hover" : "";
  const bgPrefix = camelCase([hoverPrefix, devicePrefix, "background"]);

  const cssVar = `var(--brz-${bgPrefix}-image)`;

  const normal =
    media === "image" && (bgImageSrc !== "" || bgPopulation)
      ? bgPopulation
        ? cssVar
        : `url("${getImageUrl(
            {
              uid: bgImageSrc,
              fileName: bgImageFileName,
              sizeType: bgSizeType,
              imageType: bgImageType,
              crop
            },
            config
          )}")`
      : "none";

  return isHover === "hover" ? hover : normal;
}

export function styleExportBgImage({
  v,
  device,
  state,
  getConfig,
  prefix = ""
}: CSSValue): string {
  const dvv = (key: string) => defaultValueValue({ v, key, device, state });
  const config = getConfig();

  const media = dvv("media");
  const bgImageSrc = dvv(capByPrefix(prefix, "bgImageSrc"));
  const bgSizeType = dvv(capByPrefix(prefix, "bgSizeType"));
  const bgPopulation = dvv(capByPrefix(prefix, "bgPopulation"));
  const bgImageFileName = dvv(capByPrefix(prefix, "bgImageFileName"));
  const bgImageType = dvv("bgImageType");
  const crop = isUnsplashImage(bgImageType)
    ? { ...defaultCrop, cW: UNSPLASH_BG_IMAGE_WIDTH }
    : undefined;

  const devicePrefix = device === "desktop" ? "" : device;
  const hoverPrefix = device === "desktop" && state === "hover" ? "hover" : "";
  const bgPrefix = camelCase([hoverPrefix, devicePrefix, "background"]);
  const cssVar = `var(--brz-${bgPrefix}-image)`;

  return media === "image" && (bgImageSrc !== "" || bgPopulation)
    ? bgPopulation
      ? cssVar
      : `url("${getImageUrl(
          {
            sizeType: bgSizeType,
            uid: bgImageSrc,
            fileName: bgImageFileName,
            imageType: bgImageType,
            crop
          },
          config
        )}")`
    : "none";
}

export function styleExportBgImageWithoutCssVars({
  v,
  device,
  state,
  getConfig,
  prefix = ""
}: CSSValue): string {
  const dvv = (key: string) => defaultValueValue({ v, key, device, state });
  const config = getConfig();

  const media = dvv("media");
  const bgImageSrc = dvv(capByPrefix(prefix, "bgImageSrc"));
  const bgSizeType = dvv(capByPrefix(prefix, "bgSizeType"));
  const bgPopulation = dvv(capByPrefix(prefix, "bgPopulation"));
  const bgImageFileName = dvv(capByPrefix(prefix, "bgImageFileName"));
  const bgImageType = dvv("bgImageType");
  const crop = isUnsplashImage(bgImageType)
    ? { ...defaultCrop, cW: UNSPLASH_BG_IMAGE_WIDTH }
    : undefined;
  const bg = dvv(capByPrefix(prefix, "bg"));

  if (media === "image" && (bgImageSrc !== "" || bgPopulation)) {
    return `url("${
      bgPopulation
        ? bg
        : getImageUrl(
            {
              sizeType: bgSizeType,
              uid: bgImageSrc,
              fileName: bgImageFileName,
              imageType: bgImageType,
              crop
            },
            config
          )
    }")`;
  }

  return "none";
}

export function styleBgPositionX({
  v,
  device,
  state,
  prefix = ""
}: CSSValue): string {
  const isHover = styleState({ v, state });

  const dvv = (key: string) => defaultValueValue({ v, key, device, state });
  const dvvHover = (key: string) =>
    defaultValueValue({ v, key, device, state: "hover" });

  const bgPopulation = dvv(capByPrefix(prefix, "bgPopulation"));
  const bgPositionX = dvv(capByPrefix(prefix, "bgPositionX"));

  const hoverBgPopulation = dvvHover(capByPrefix(prefix, "bgPopulation"));
  const hoverBgPositionX = dvvHover(capByPrefix(prefix, "bgPositionX"));
  return isHover === "hover" && !hoverBgPopulation
    ? `${hoverBgPositionX}%`
    : !bgPopulation
      ? `${bgPositionX}%`
      : "50%";
}

export function styleBgPositionY({
  v,
  device,
  state,
  prefix = ""
}: CSSValue): string {
  const isHover = styleState({ v, state });

  const dvv = (key: string) => defaultValueValue({ v, key, device, state });
  const dvvHover = (key: string) =>
    defaultValueValue({ v, key, device, state: "hover" });

  const bgPopulation = dvv(capByPrefix(prefix, "bgPopulation"));
  const bgPositionY = dvv(capByPrefix(prefix, "bgPositionY"));

  const hoverBgPopulation = dvvHover(capByPrefix(prefix, "bgPopulation"));
  const hoverBgPositionY = dvvHover(capByPrefix(prefix, "bgPositionY"));
  return isHover === "hover" && !hoverBgPopulation
    ? `${hoverBgPositionY}%`
    : !bgPopulation
      ? `${bgPositionY}%`
      : "50%";
}
