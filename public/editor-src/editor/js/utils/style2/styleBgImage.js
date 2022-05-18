import { styleState } from "visual/utils/style";
import { defaultValueValue } from "visual/utils/onChange";
import {
  imageUrl,
  svgUrl,
  imageSpecificSize,
  imagePopulationUrl
} from "visual/utils/image";
import {
  getImageSize,
  isPredefinedSize,
  isOriginalSize
} from "../../editorComponents/Image/utils";

const isSVG = extension => extension === "svg";

export function styleBgImage({ v, device, state }) {
  const isHover = styleState({ v, state });

  const media = defaultValueValue({ v, key: "media", device, state });

  const bgImageSrc = defaultValueValue({ v, key: "bgImageSrc", device, state });

  const bgSizeType = defaultValueValue({
    v,
    key: "bgSizeType",
    device,
    state
  });

  const bgSize = getImageSize(bgSizeType);

  const bgImageExtension = defaultValueValue({
    v,
    key: "bgImageExtension",
    device,
    state
  });

  const bgPopulation = defaultValueValue({
    v,
    key: "bgPopulation",
    device,
    state
  });

  const hoverMedia = defaultValueValue({
    v,
    key: "media",
    device,
    state: "hover"
  });

  const hoverBgImageSrc = defaultValueValue({
    v,
    key: "bgImageSrc",
    device,
    state: "hover"
  });

  const hoverBgImageExtension = defaultValueValue({
    v,
    key: "bgImageExtension",
    device,
    state: "hover"
  });

  const hoverBgPopulation = defaultValueValue({
    v,
    key: "bgPopulation",
    device,
    state: "hover"
  });

  if (isPredefinedSize(bgSize) || isOriginalSize(bgSize)) {
    return `url(${imageSpecificSize(bgImageSrc, bgSizeType)})`;
  }

  const hover =
    hoverMedia === "image" && hoverBgImageSrc !== "" && !hoverBgPopulation
      ? `url(${
          isSVG(hoverBgImageExtension)
            ? svgUrl(hoverBgImageSrc)
            : imageUrl(hoverBgImageSrc)
        })`
      : "none";

  const normal =
    media === "image" && bgImageSrc !== "" && bgPopulation === ""
      ? `url(${
          isSVG(bgImageExtension) ? svgUrl(bgImageSrc) : imageUrl(bgImageSrc)
        })`
      : "none";

  return isHover === "hover" ? hover : normal;
}

export function styleExportBgImage({ v, device, state }) {
  const media = defaultValueValue({ v, key: "media", device, state });

  const bgImageSrc = defaultValueValue({ v, key: "bgImageSrc", device, state });

  const bgImageExtension = defaultValueValue({
    v,
    key: "bgImageExtension",
    device,
    state
  });

  const bgPopulation = defaultValueValue({
    v,
    key: "bgPopulation",
    device,
    state
  });

  const bgImage = bgPopulation
    ? imagePopulationUrl(bgPopulation)
    : isSVG(bgImageExtension)
    ? svgUrl(bgImageSrc)
    : imageUrl(bgImageSrc);

  return media === "image" && (bgImageSrc !== "" || bgPopulation !== "")
    ? `url(${bgImage})`
    : "none";
}

export function styleBgPositionX({ v, device, state }) {
  const isHover = styleState({ v, state });
  const bgPopulation = defaultValueValue({
    v,
    key: "bgPopulation",
    device,
    state
  });
  const bgPositionX = defaultValueValue({
    v,
    key: "bgPositionX",
    device,
    state
  });
  const hoverBgPopulation = defaultValueValue({
    v,
    key: "bgPopulation",
    device,
    state: "hover"
  });
  const hoverBgPositionX = defaultValueValue({
    v,
    key: "bgPositionX",
    device,
    state: "hover"
  });

  return isHover === "hover" && !hoverBgPopulation
    ? `${hoverBgPositionX}%`
    : bgPopulation === ""
    ? `${bgPositionX}%`
    : 0;
}

export function styleBgPositionY({ v, device, state }) {
  const isHover = styleState({ v, state });
  const bgPopulation = defaultValueValue({
    v,
    key: "bgPopulation",
    device,
    state
  });
  const bgPositionY = defaultValueValue({
    v,
    key: "bgPositionY",
    device,
    state
  });
  const hoverBgPopulation = defaultValueValue({
    v,
    key: "bgPopulation",
    device,
    state: "hover"
  });
  const hoverBgPositionY = defaultValueValue({
    v,
    key: "bgPositionY",
    device,
    state: "hover"
  });

  return isHover === "hover" && !hoverBgPopulation
    ? `${hoverBgPositionY}%`
    : bgPopulation === ""
    ? `${bgPositionY}%`
    : 0;
}
