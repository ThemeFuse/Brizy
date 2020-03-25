import { defaultValueValue } from "visual/utils/onChange";

export function styleElementCommentsLogoSize({ v, device, state = "normal" }) {
  return defaultValueValue({ v, key: "logoSize", device, state });
}

export function styleElementCommentsSkin({ v, device, state = "normal" }) {
  return defaultValueValue({ v, key: "skin", device, state });
}
