import { defaultValueValue } from "visual/utils/onChange";

export function styleMediaBg({ v, device }) {
  return defaultValueValue({ v, key: "media", device });
}
