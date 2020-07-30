import { defaultValueValue } from "visual/utils/onChange";

export function styleElementPostNavigationSpacing({ v, device, state }) {
  return defaultValueValue({ v, key: "spacing", device, state });
}

export function styleElementPostNavigationShowPost({ v, device, state }) {
  return defaultValueValue({ v, key: "showPost", device, state });
}

export function styleElementPostNavigationShowSeparation({ v, device, state }) {
  return defaultValueValue({ v, key: "showSeparation", device, state });
}
