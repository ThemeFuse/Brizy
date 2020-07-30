import { defaultValueValue } from "visual/utils/onChange";

export function styleElementWOOProductMetaType({ v, device, state }) {
  const dvv = key => defaultValueValue({ v, key, device, state });

  return dvv("elementType");
}

export function styleElementWOOProductMetaTopSpacing({ v, device, state }) {
  const dvv = key => defaultValueValue({ v, key, device, state });

  return dvv("topSpacing");
}

export function styleElementWOOProductMetaRightSpacing({ v, device, state }) {
  const dvv = key => defaultValueValue({ v, key, device, state });

  return dvv("rightSpacing");
}
