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
