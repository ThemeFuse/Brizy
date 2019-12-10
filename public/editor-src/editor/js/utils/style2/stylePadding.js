import { defaultValueValue } from "visual/utils/onChange";
import { capByPrefix } from "visual/utils/string";

export function stylePaddingType({ v, device, state, prefix = "" }) {
  const dvv = key => defaultValueValue({ v, key, device, state });
  const padding = capByPrefix(prefix, "padding");

  return dvv(capByPrefix(padding, "type"));
}

export function stylePaddingGrouped({ v, device, state, prefix = "" }) {
  const dvv = key => defaultValueValue({ v, key, device, state });

  return dvv(capByPrefix(prefix, "padding"));
}

export function stylePaddingUngrouped({
  v,
  device,
  state,
  prefix = "",
  current = "paddingTop"
}) {
  const dvv = key => defaultValueValue({ v, key, device, state });

  return dvv(capByPrefix(prefix, current));
}

export function stylePaddingGroupedSuffix({ v, device, state, prefix = "" }) {
  const dvv = key => defaultValueValue({ v, key, device, state });
  const padding = capByPrefix(prefix, "padding");

  return dvv(capByPrefix(padding, "suffix"));
}

export function stylePaddingUngroupedSuffix({
  v,
  device,
  state,
  prefix = "",
  current = "paddingTopSuffix"
}) {
  const dvv = key => defaultValueValue({ v, key, device, state });

  return dvv(capByPrefix(prefix, current));
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
