import { defaultValueValue } from "visual/utils/onChange";

export function styleElementWOOCartSubtotalDisabled({ v, device, state }) {
  const dvv = key => defaultValueValue({ v, key, device, state });

  return dvv("subtotal");
}

export function styleElementWOOCartPurchasesDisabled({ v, device, state }) {
  const dvv = key => defaultValueValue({ v, key, device, state });

  return dvv("purchases");
}

export function styleElementWOOCartButtonDirection({ v, device, state }) {
  const dvv = key => defaultValueValue({ v, key, device, state });

  return dvv("buttonDirection");
}

export function styleElementWOOCartButtonSpacing({ v, device, state }) {
  const dvv = key => defaultValueValue({ v, key, device, state });

  return dvv("buttonSpacing");
}

export function styleElementWOOCartSidebarHorizontalAlign({
  v,
  device,
  state
}) {
  const dvv = key => defaultValueValue({ v, key, device, state });

  return dvv("cartHorizontalAlign");
}

export function styleElementWOOCartSidebarVerticalAlign({ v, device, state }) {
  const dvv = key => defaultValueValue({ v, key, device, state });

  return dvv("cartVerticalAlign");
}

export function styleElementWOOCartSidebarWidth({ v, device, state }) {
  const dvv = key => defaultValueValue({ v, key, device, state });

  return dvv("sidebarWidth");
}

export function styleElementWOOCartSidebarWidthSuffix({ v, device, state }) {
  const dvv = key => defaultValueValue({ v, key, device, state });

  return dvv("sidebarWidthSuffix");
}

export function styleElementWOOCartSidebarHeightStyle({ v, device, state }) {
  const dvv = key => defaultValueValue({ v, key, device, state });

  return dvv("sidebarHeightStyle");
}

export function styleElementWOOCartSidebarHeight({ v, device, state }) {
  const dvv = key => defaultValueValue({ v, key, device, state });

  return dvv("sidebarHeight");
}

export function styleElementWOOCartSidebarHeightSuffix({ v, device, state }) {
  const dvv = key => defaultValueValue({ v, key, device, state });

  return dvv("sidebarHeightSuffix");
}
