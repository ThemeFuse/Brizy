import { defaultValueValue } from "visual/utils/onChange";

export function styleElementWOOGallerySpacing({ v, device, state }) {
  const dvv = key => defaultValueValue({ v, key, device, state });

  return dvv("spacing");
}

export function styleElementWOOGalleryBetweenThumbnail({ v, device, state }) {
  const dvv = key => defaultValueValue({ v, key, device, state });

  return dvv("betweenThumbnail");
}
