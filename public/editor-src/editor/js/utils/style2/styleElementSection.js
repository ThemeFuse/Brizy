import { defaultValueValue } from "visual/utils/onChange";

export function styleElementSectionContainerType({ v, device, state }) {
  const dvv = key => defaultValueValue({ v, key, device, state });

  return dvv("containerType");
}

export function styleElementSectionContainerSize({ v, device, state }) {
  const dvv = key => defaultValueValue({ v, key, device, state });

  return dvv("containerSize");
}

export function styleElementSectionSliderHeight({ v }) {
  const { slider } = v;
  return slider;
}

export function styleElementSectionHeight({ v, device }) {
  return defaultValueValue({ v, key: "fullHeight", device });
}

export function styleElementSectionMinHeightType({ v, device }) {
  return defaultValueValue({ v, key: "sectionHeightStyle", device });
}

export function styleElementSectionMinHeight({ v, device }) {
  return defaultValueValue({ v, key: "sectionHeight", device });
}

export function styleElementSectionMinHeightSuffix({ v, device }) {
  return defaultValueValue({ v, key: "sectionHeightSuffix", device });
}
