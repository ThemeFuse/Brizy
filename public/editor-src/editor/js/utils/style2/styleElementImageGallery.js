import { defaultValueValue } from "visual/utils/onChange";

export function styleElementImageGalleryGridColumn({ v, device }) {
  return defaultValueValue({ v, key: "gridColumn", device });
}

export function styleElementImageGallerySpacing({ v, device }) {
  return defaultValueValue({ v, key: "spacing", device });
}
