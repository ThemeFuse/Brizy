import { defaultValueValue } from "visual/utils/onChange";

export function styleElementMenuIconPosition({ v, device, state }) {
  const dvv = (key) => defaultValueValue({ v, key, device, state });

  return dvv("iconPosition");
}

export function styleElementMenuIconSpacing({ v, device, state }) {
  const dvv = (key) => defaultValueValue({ v, key, device, state });

  return dvv("iconSpacing");
}

export function styleElementMenuMode({ v, device, state }) {
  const dvv = (key) => defaultValueValue({ v, key, device, state });

  return dvv("verticalMode");
}

// MMenu
export function styleElementMMenu({ v, device, state }) {
  const dvv = (key) => defaultValueValue({ v, key, device, state });

  return dvv("mMenu");
}

export function styleElementMMenuIconSpacing({ v, device, state }) {
  const dvv = (key) => defaultValueValue({ v, key, device, state });

  return dvv("mMenuIconSpacing");
}

export function styleElementMMenuIconPosition({ v, device, state }) {
  const dvv = (key) => defaultValueValue({ v, key, device, state });

  return dvv("mMenuIconPosition");
}

// SubMenu
export function styleElementMenuSubMenuIconPosition({ v, device, state }) {
  const dvv = (key) => defaultValueValue({ v, key, device, state });

  return dvv("subMenuIconPosition");
}

export function styleElementMenuSubMenuIconSpacing({ v, device, state }) {
  const dvv = (key) => defaultValueValue({ v, key, device, state });

  return dvv("subMenuIconSpacing");
}
