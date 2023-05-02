import { defaultValueValue } from "visual/utils/onChange";
import { capByPrefix } from "visual/utils/string";

export function styleMarginType({ v, device, state, prefix = "" }) {
  const dvv = (key) => defaultValueValue({ v, key, device, state });

  return dvv(capByPrefix(prefix, "marginType"));
}

export function styleMarginGrouped({ v, device, state, prefix = "" }) {
  const dvv = (key) => defaultValueValue({ v, key, device, state });

  return dvv(capByPrefix(prefix, "margin"));
}

export function styleMarginUngrouped({
  v,
  device,
  state,
  current,
  prefix = ""
}) {
  const dvv = (key) => defaultValueValue({ v, key, device, state });

  return dvv(capByPrefix(prefix, current));
}

export function styleMarginGroupedSuffix({ v, device, state, prefix = "" }) {
  const dvv = (key) => defaultValueValue({ v, key, device, state });

  return dvv(capByPrefix(prefix, "marginSuffix"));
}

export function styleMarginUngroupedSuffix({
  v,
  device,
  state,
  current,
  prefix = ""
}) {
  const dvv = (key) => defaultValueValue({ v, key, device, state });

  return dvv(capByPrefix(prefix, current));
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
