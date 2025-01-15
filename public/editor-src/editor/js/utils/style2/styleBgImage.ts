import { defaultCrop } from "visual/global/Config/types/configs/common";
import { configSelector } from "visual/redux/selectors";
import { getImageUrl } from "visual/utils/image";
import {
  UNSPLASH_BG_IMAGE_WIDTH,
  isUnsplashImage
} from "visual/utils/image/utils";
import { defaultValueValue } from "visual/utils/onChange";
import { capByPrefix } from "visual/utils/string";
import { styleState } from "visual/utils/style";
import { CSSValue } from "./types";

export function styleBgImage({
  v,
  device,
  state,
  store,
  prefix = ""
}: CSSValue): string {
  const isHover = styleState({ v, state });
  const dvv = (key: string) => defaultValueValue({ v, key, device, state });
  const dvvHover = (key: string) =>
    defaultValueValue({ v, key, device, state: "hover" });
  const config = configSelector(store.getState());

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
        ? `var(--brz-background-image)`
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

  const normal =
    media === "image" && (bgImageSrc !== "" || bgPopulation)
      ? bgPopulation
        ? `var(--brz-background-image)`
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
  store,
  prefix = ""
}: CSSValue): string {
  const dvv = (key: string) => defaultValueValue({ v, key, device, state });
  const config = configSelector(store.getState());

  const media = dvv("media");
  const bgImageSrc = dvv(capByPrefix(prefix, "bgImageSrc"));
  const bgSizeType = dvv(capByPrefix(prefix, "bgSizeType"));
  const bgPopulation = dvv(capByPrefix(prefix, "bgPopulation"));
  const bgImageFileName = dvv(capByPrefix(prefix, "bgImageFileName"));
  const bgImageType = dvv("bgImageType");
  const crop = isUnsplashImage(bgImageType)
    ? { ...defaultCrop, cW: UNSPLASH_BG_IMAGE_WIDTH }
    : undefined;

  return media === "image" && (bgImageSrc !== "" || bgPopulation)
    ? bgPopulation
      ? `var(--brz-background-image)`
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
