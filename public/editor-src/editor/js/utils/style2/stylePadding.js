import { defaultValueValue } from "visual/utils/onChange";

export function stylePaddingType({ v, device, state }) {
  return defaultValueValue({ v, key: "paddingType", device, state });
}

export function stylePaddingGrouped({ v, device, state }) {
  return defaultValueValue({ v, key: "padding", device, state });
}

export function stylePaddingUngrouped({ v, device, state, current }) {
  return defaultValueValue({ v, key: current, device, state });
}

export function stylePaddingGroupedSuffix({ v, device, state }) {
  return defaultValueValue({ v, key: "paddingSuffix", device, state });
}

export function stylePaddingUngroupedSuffix({ v, device, state, current }) {
  return defaultValueValue({ v, key: current, device, state });
}

export function styleItemPaddingTop({ v, device }) {
  return `${defaultValueValue({ v, key: "itemPaddingTop", device })}px`;
}

export function styleItemPaddingRight({ v, device }) {
  return `${parseFloat(
    defaultValueValue({ v, key: "itemPaddingRight", device }) / 2
  )}px`;
}

export function styleItemPaddingBottom({ v, device }) {
  return `${defaultValueValue({ v, key: "itemPaddingBottom", device })}px`;
}

export function styleItemPaddingLeft({ v, device }) {
  return `${parseFloat(
    defaultValueValue({ v, key: "itemPaddingLeft", device }) / 2
  )}px`;
}