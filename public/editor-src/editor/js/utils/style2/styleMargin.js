import { defaultValueValue } from "visual/utils/onChange";

export function styleMarginType({ v, device, state }) {
  return defaultValueValue({ v, key: "marginType", device, state });
}

export function styleMarginGrouped({ v, device, state }) {
  return defaultValueValue({ v, key: "margin", device, state });
}

export function styleMarginUngrouped({ v, device, state, current }) {
  return defaultValueValue({ v, key: current, device, state });
}

export function styleMarginGroupedSuffix({ v, device, state }) {
  return defaultValueValue({ v, key: "marginSuffix", device, state });
}

export function styleMarginUngroupedSuffix({ v, device, state, current }) {
  return defaultValueValue({ v, key: current, device, state });
}

export function styleItemMarginTop({ v, device }) {
  return `${-defaultValueValue({ v, key: "itemPaddingTop", device })}px`;
}

export function styleItemMarginRight({ v, device }) {
  return `${parseFloat(
    -defaultValueValue({ v, key: "itemPaddingRight", device }) / 2
  )}px`;
}

export function styleItemMarginBottom({ v, device }) {
  return `${-defaultValueValue({ v, key: "itemPaddingBottom", device })}px`;
}

export function styleItemMarginLeft({ v, device }) {
  return `${parseFloat(
    -defaultValueValue({ v, key: "itemPaddingLeft", device }) / 2
  )}px`;
}
