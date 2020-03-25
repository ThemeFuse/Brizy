import { defaultValueValue } from "visual/utils/onChange";

export function styleElementTimelineWidth({ v, device, state }) {
  const dvv = key => defaultValueValue({ v, key, device, state });

  return dvv("width");
}

export function styleElementTimelineWidthSuffix({ v, device, state }) {
  const dvv = key => defaultValueValue({ v, key, device, state });

  return dvv("widthSuffix");
}

export function styleElementTimelineTabsCount({ v, device, state }) {
  const dvv = key => defaultValueValue({ v, key, device, state });

  return dvv("tabsCount");
}

export function styleElementTimelineVerticalMode({ v, device, state }) {
  const dvv = key => defaultValueValue({ v, key, device, state });

  return dvv("verticalMode");
}

export function styleElementTimelineIconCustomSize({ v, device, state }) {
  const dvv = key => defaultValueValue({ v, key, device, state });

  return dvv("customSize");
}

export function styleElementTimelineIconPadding({ v, device, state }) {
  const dvv = key => defaultValueValue({ v, key, device, state });

  return dvv("iconPadding");
}

export function styleElementTimelineEnableText({ v, device, state }) {
  const dvv = key => defaultValueValue({ v, key, device, state });

  return dvv("enableText");
}

export function styleElementTimelineSpacing({ v, device, state }) {
  const dvv = key => defaultValueValue({ v, key, device, state });

  return dvv("spacing");
}

export function styleElementTimelineStyle({ v, device, state }) {
  const dvv = key => defaultValueValue({ v, key, device, state });

  return dvv("timelineStyle");
}

export function styleElementTimelineOrientation({ v, device, state }) {
  const dvv = key => defaultValueValue({ v, key, device, state });

  return dvv("verticalMode");
}
