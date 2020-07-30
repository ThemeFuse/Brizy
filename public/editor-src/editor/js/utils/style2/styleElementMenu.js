import { defaultValueValue } from "visual/utils/onChange";
import { getOptionColorHexByPalette } from "visual/utils/options";
import { hexToRgba } from "visual/utils/color";

export function styleElementMenuIconSpacing({ v, device, state }) {
  const dvv = key => defaultValueValue({ v, key, device, state });

  return dvv("iconSpacing");
}

export function styleElementMenuIconSize({ v, device, state }) {
  const dvv = key => defaultValueValue({ v, key, device, state });

  return dvv("iconSize");
}

export function styleElementMenuMode({ v, device, state }) {
  const dvv = key => defaultValueValue({ v, key, device, state });

  return dvv("verticalMode");
}

export function styleElementMenuSize({ v, device, state }) {
  const dvv = key => defaultValueValue({ v, key, device, state });

  return dvv("menuSize");
}

// MMenu
export function styleElementMMenu({ v, device, state }) {
  const dvv = key => defaultValueValue({ v, key, device, state });

  return dvv("mMenu");
}

export function styleElementMMenuSize({ v, device, state }) {
  const dvv = key => defaultValueValue({ v, key, device, state });

  return dvv("mMenuSize");
}

export function styleElementMMenuIconSpacing({ v, device, state }) {
  const dvv = key => defaultValueValue({ v, key, device, state });

  return dvv("mMenuIconSpacing");
}

export function styleElementMMenuIconSize({ v, device, state }) {
  const dvv = key => defaultValueValue({ v, key, device, state });

  return dvv("mMenuIconSize");
}

export function styleElementMMenuHoverColor({ v, device, state }) {
  const dvv = key => defaultValueValue({ v, key, device, state });
  const { hex } = getOptionColorHexByPalette(
    dvv("mMenuHoverColorHex"),
    dvv("mMenuHoverColorPalette")
  );

  return hexToRgba(hex, dvv("mMenuHoverColorOpacity"));
}

// SubMenu
export function styleElementMenuSubMenuIconSpacing({ v, device, state }) {
  const dvv = key => defaultValueValue({ v, key, device, state });

  return dvv("subMenuIconSpacing");
}

export function styleElementMenuSubMenuIconSize({ v, device, state }) {
  const dvv = key => defaultValueValue({ v, key, device, state });

  return dvv("subMenuIconSize");
}
