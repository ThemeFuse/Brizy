import { defaultValueValue } from "visual/utils/onChange";

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

export function styleItemMarginTop({ v, device }) {
  `${-defaultValueValue({ v, key: "itemPaddingTop", device })}px`;
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
