import { styleState } from "visual/utils/style";
import { defaultValueValue } from "visual/utils/onChange";
import { imageUrl, imagePopulationUrl } from "visual/utils/image";

export function styleBgImage({ v, device, state }) {
  const isHover = styleState({ v, state });
  const media = defaultValueValue({ v, key: "media", device, state });
  const bgImageSrc = defaultValueValue({ v, key: "bgImageSrc", device, state });
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
  const hoverBgPopulation = defaultValueValue({
    v,
    key: "bgPopulation",
    device,
    state: "hover"
  });

  return isHover === "hover" &&
    hoverMedia === "image" &&
    hoverBgImageSrc !== "" &&
    hoverBgPopulation === ""
    ? `url(${imageUrl(hoverBgImageSrc)})`
    : media === "image" && bgImageSrc !== "" && bgPopulation === ""
    ? `url(${imageUrl(bgImageSrc)})`
    : "none";
}

export function styleExportBgImage({ v, device, state }) {
  const media = defaultValueValue({ v, key: "media", device, state });
  const bgImageSrc = defaultValueValue({
    v,
    key: "bgImageSrc",
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

  return isHover === "hover" && hoverBgPopulation === ""
    ? `${hoverBgPositionX}%`
    : bgPopulation === ""
    ? `${bgPositionX}%`
    : "0%";
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

  return isHover === "hover" && hoverBgPopulation === ""
    ? `${hoverBgPositionY}%`
    : bgPopulation === ""
    ? `${bgPositionY}%`
    : "0%";
}
