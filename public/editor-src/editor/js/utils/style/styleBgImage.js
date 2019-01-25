import { imageUrl } from "visual/utils/image";
import { defaultValueValue } from "visual/utils/onChange";

export function styleBgImage({ v, device, state }) {
  return defaultValueValue({ v, key: "bgImageSrc", device, state }) !== ""
    ? `url(${imageUrl(
        defaultValueValue({ v, key: "bgImageSrc", device, state })
      )})`
    : "none";
}

export function styleBgPositionX({ v, device, state }) {
  return `${defaultValueValue({ v, key: "bgPositionX", device, state })}%`;
}

export function styleBgPositionY({ v, device, state }) {
  return `${defaultValueValue({ v, key: "bgPositionY", device, state })}%`;
}
