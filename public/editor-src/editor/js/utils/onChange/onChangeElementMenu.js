//menu Color
export function onChangeMenuColorHex2({
  v,
  hex,
  opacity,
  isChanged,
  opacityDragEnd
}) {
  opacity =
    hex !== v.colorHex && v.colorOpacity === 0 ? v.tempColorOpacity : opacity;

  return {
    colorHex: hex,
    colorOpacity: opacity,
    colorPalette: isChanged === "hex" ? "" : v.colorPalette,

    // Temporary Value changes
    tempColorOpacity:
      opacity > 0 && opacityDragEnd ? opacity : v.tempColorOpacity,

    // Normal + Hover Sync
    hoverColorHex: v.colorHex === v.hoverColorHex ? hex : v.hoverColorHex,

    hoverColorOpacity:
      v.colorOpacity === v.hoverColorOpacity ? opacity : v.hoverColorOpacity
  };
}

export function onChangeMenuColorPalette2({ v, palette }) {
  return {
    colorPalette: palette,

    colorOpacity: v.colorOpacity === 0 ? v.tempColorOpacity : v.colorOpacity,

    // Normal + Hover Sync
    hoverColorPalette:
      v.colorPalette === v.hoverColorPalette ? palette : v.hoverColorPalette
  };
}

export function onChangeMenuColorFields2({ v, hex, opacity, isChanged }) {
  return {
    colorPalette: isChanged === "hex" ? "" : v.colorPalette,
    colorHex: hex,
    colorOpacity: opacity,

    // Normal + Hover Sync
    hoverColorHex: v.colorHex === v.hoverColorHex ? hex : v.hoverColorHex,

    hoverColorOpacity:
      v.colorOpacity === v.hoverColorOpacity ? opacity : v.hoverColorOpacity
  };
}

//menu Color Hover
export function onChangeMenuHoverColorHex2({
  v,
  hex,
  opacity,
  isChanged,
  opacityDragEnd
}) {
  opacity =
    hex !== v.colorHex && v.colorOpacity === 0 ? v.tempColorOpacity : opacity;

  return {
    hoverColorHex: hex,
    hoverColorOpacity:
      hex !== v.hoverColorHex &&
      v.hoverColorOpacity === 0
        ? v.tempHoverColorOpacity
        : opacity,
    hoverColorPalette:
      isChanged === "hex" ? "" : v.hoverColorPalette
  };
}

export function onChangeMenuHoverColorPalette2({ v, palette }) {
  return {
    hoverColorPalette: palette,
    hoverColorOpacity:
      v.hoverColorOpacity === 0
        ? v.tempHoverColorOpacity
        : v.hoverColorOpacity
  };
}

export function onChangeMenuHoverColorFields2({ v, hex, opacity, isChanged }) {
  return {
    hoverColorPalette:
    isChanged === "hex"
      ? ""
      : v.hoverColorPalette,
  hoverColorHex: hex,
  hoverColorOpacity: opacity
  };
}

// MMenu Colors
export function onChangeColorHexMMenu2({
  v,
  hex,
  opacity,
  isChanged,
  opacityDragEnd
}) {
  opacity =
    hex !== v.mMenuColorHex && v.mMenuColorOpacity == 0
      ? v.mMenuTempColorOpacity
      : opacity;

  return {
    mMenuColorHex: hex,
    mMenuColorOpacity: opacity,
    mMenuColorPalette: isChanged === "hex" ? "" : v.mMenuColorPalette,

    // Temporary Value changes
    mMenuTempColorOpacity:
      opacity > 0 && opacityDragEnd ? opacity : v.mMenuTempColorOpacity,

    // Normal + Hover Sync
    mMenuHoverColorHex:
      v.mMenuColorHex === v.mMenuHoverColorHex ? hex : v.mMenuHoverColorHex,

    mMenuHoverColorOpacity:
      v.mMenuColorOpacity === v.mMenuHoverColorOpacity
        ? opacity
        : v.mMenuHoverColorOpacity
  };
}

export function onChangeColorPaletteMMenu2({ v, palette }) {
  return {
    mMenuColorPalette: palette,

    mMenuColorOpacity:
      v.mMenuColorOpacity === 0 ? v.mMenuTempColorOpacity : v.mMenuColorOpacity
  };
}

export function onChangeColorFieldsMMenu2({ v, hex, opacity, isChanged }) {
  return {
    mMenuColorPalette: isChanged === "hex" ? "" : v.mMenuColorPalette,
    mMenuColorHex: hex,
    mMenuColorOpacity: opacity
  };
}

export function onChangeHoverColorHexMMenu2({ v, hex, opacity, isChanged }) {
  return {
    mMenuHoverColorHex: hex,
    mMenuHoverColorOpacity:
      hex !== v.mMenuHoverColorHex && v.mMenuHoverColorOpacity == 0
        ? v.mMenuTempHoverColorOpacity
        : opacity,

    mMenuHoverColorPalette: isChanged === "hex" ? "" : v.mMenuHoverColorPalette
  };
}

export function onChangeHoverColorPaletteMMenu2({ v, palette }) {
  return {
    mMenuHoverColorPalette: palette,
    mMenuHoverColorOpacity:
      v.mMenuHoverColorOpacity === 0
        ? v.mMenuTempHoverColorOpacity
        : v.mMenuHoverColorOpacity
  };
}

export function onChangeHoverColorFieldsMMenu2({ v, hex, opacity, isChanged }) {
  return {
    mMenuHoverColorPalette: isChanged === "hex" ? "" : v.mMenuHoverColorPalette,
    mMenuHoverColorHex: hex,
    mMenuHoverColorOpacity: opacity
  };
}

// SubMenu Colors
export function onChangeColorHexSubMenu2({
  v,
  hex,
  opacity,
  isChanged,
  opacityDragEnd
}) {
  opacity =
    hex !== v.subMenuColorHex && v.subMenuColorOpacity === 0
      ? v.subMenuTempColorOpacity
      : opacity;

  return {
    subMenuColorHex: hex,
    subMenuColorOpacity: opacity,
    subMenuColorPalette: isChanged === "hex" ? "" : v.subMenuColorPalette,

    // Temporary Value changes
    subMenuTempColorOpacity:
      opacity > 0 && opacityDragEnd ? opacity : v.subMenuTempColorOpacity,

    // Normal + Hover Sync
    subMenuHoverColorHex:
      v.subMenuColorHex === v.subMenuHoverColorHex
        ? hex
        : v.subMenuHoverColorHex,

    subMenuHoverColorOpacity:
      v.subMenuColorOpacity === v.subMenuHoverColorOpacity
        ? opacity
        : v.subMenuHoverColorOpacity,

    // Sync MMenu
    mMenuColorHex:
      v.subMenuColorHex === v.mMenuColorHex ? hex : v.mMenuColorHex,
    mMenuColorOpacity:
      v.subMenuColorOpacity === v.mMenuColorOpacity
        ? opacity
        : v.mMenuColorOpacity,

    // MMenu + Hover Sync
    mMenuHoverColorHex:
      v.subMenuColorHex === v.mMenuHoverColorHex ? hex : v.mMenuHoverColorHex,

    mMenuHoverColorOpacity:
      v.subMenuColorOpacity === v.mMenuHoverColorOpacity
        ? opacity
        : v.mMenuHoverColorOpacity
  };
}

export function onChangeColorPaletteSubMenu2({ v, palette }) {
  return {
    subMenuColorPalette: palette,
    subMenuColorOpacity:
      v.subMenuColorOpacity === 0
        ? v.subMenuTempColorOpacity
        : v.subMenuColorOpacity,

    // Normal + Hover Sync
    subMenuHoverColorPalette:
      v.subMenuColorPalette === v.subMenuHoverColorPalette
        ? palette
        : v.subMenuHoverColorPalette,

    // Sync MMenu
    mMenuColorPalette:
      v.subMenuColorPalette === v.mMenuColorPalette
        ? palette
        : v.mMenuColorPalette,

    mMenuHoverColorPalette:
      v.subMenuColorPalette === v.mMenuHoverColorPalette
        ? palette
        : v.mMenuHoverColorPalette
  };
}

export function onChangeColorFieldsSubMenu2({ v, hex, opacity, isChanged }) {
  return {
    subMenuColorPalette: isChanged === "hex" ? "" : v.subMenuColorPalette,
    subMenuColorHex: hex,
    subMenuColorOpacity: opacity,

    // Normal + Hover Sync
    subMenuHoverColorHex:
      v.subMenuColorHex === v.subMenuHoverColorHex
        ? hex
        : v.subMenuHoverColorHex,

    subMenuHoverColorOpacity:
      v.subMenuColorOpacity === v.subMenuHoverColorOpacity
        ? hex
        : v.subMenuHoverColorOpacity,

    // Sync MMenu
    mMenuColorHex:
      v.subMenuColorHex === v.mMenuColorHex ? hex : v.mMenuBgColorHex,
    mMenuColorOpacity:
      v.subMenuColorOpacity === v.mMenuColorOpacity
        ? opacity
        : v.mMenuColorOpacity,

    // MMenu + Hover Sync
    mMenuHoverColorHex:
      v.subMenuColorHex === v.mMenuHoverColorHex ? hex : v.mMenuHoverColorHex,

    mMenuHoverColorOpacity:
      v.subMenuColorOpacity === v.mMenuHoverColorOpacity
        ? opacity
        : v.mMenuHoverColorOpacity
  };
}

export function onChangeHoverColorHexSubMenu2({ v, hex, opacity, isChanged }) {
  return {
    subMenuHoverColorHex: hex,
    subMenuHoverColorOpacity:
      hex !== v.subMenuHoverColorHex && v.subMenuHoverColorOpacity === 0
        ? v.subMenuTempHoverColorOpacity
        : opacity,
    subMenuHoverColorPalette:
      isChanged === "hex" ? "" : v.subMenuHoverColorPalette,

    // MMenu + Hover Sync
    mMenuHoverColorHex:
      v.subMenuHoverColorHex === v.mMenuHoverColorHex
        ? hex
        : v.mMenuHoverColorHex,

    mMenuHoverColorOpacity:
      v.subMenuHoverColorOpacity === v.mMenuHoverColorOpacity
        ? opacity
        : v.mMenuHoverColorOpacity
  };
}

export function onChangeHoverColorPaletteSubMenu2({ v, palette }) {
  return {
    subMenuHoverColorPalette: palette,
    subMenuHoverColorOpacity:
      v.subMenuHoverColorOpacity === 0
        ? v.subMenuTempHoverColorOpacity
        : v.subMenuHoverColorOpacity,

    // MMenu Sync
    mMenuHoverColorPalette:
      v.subMenuHoverColorPalette === v.mMenuHoverColorPalette
        ? palette
        : v.mMenuHoverColorPalette
  };
}

export function onChangeHoverColorFieldsSubMenu2({
  v,
  hex,
  opacity,
  isChanged
}) {
  return {
    subMenuHoverColorPalette:
      isChanged === "hex" ? "" : v.subMenuHoverColorPalette,
    subMenuHoverColorHex: hex,
    subMenuHoverColorOpacity: opacity,

    // Sync MMenu
    mMenuHoverColorHex:
      v.subMenuHoverColorHex === v.mMenuHoverColorHex
        ? hex
        : v.mMenuHoverColorHex,
    mMenuHoverColorOpacity:
      v.subMenuHoverColorOpacity === v.mMenuHoverColorOpacity
        ? opacity
        : v.mMenuHoverColorOpacity
  };
}

// Icon Menu Colors

export function onChangeColorHexIconMenu2({ v, hex, opacity, isChanged }) {
  const mMenuIconColorOpacity =
    hex !== v.mMenuIconColorHex && v.mMenuIconColorOpacity === 0
      ? v.mMenuTempIconColorOpacity
      : opacity;

  return {
    mMenuIconColorHex: hex,
    mMenuIconColorOpacity: mMenuIconColorOpacity,
    mMenuIconColorPalette: isChanged === "hex" ? "" : v.mMenuIconColorPalette
  };
}

export function onChangeColorPaletteIconMenu2({ v, palette }) {
  return {
    mMenuIconColorPalette: palette,
    mMenuIconColorHex: "",
    mMenuIconColorOpacity:
      v.mMenuIconColorOpacity === 0
        ? v.mMenuTempIconColorOpacity
        : v.mMenuIconColorOpacity
  };
}

export function onChangeColorFieldsIconMenu2({ v, hex, opacity, isChanged }) {
  const mMenuIconColorOpacity =
    hex !== v.mMenuIconColorHex && v.mMenuIconColorOpacity === 0
      ? v.mMenuTempIconColorOpacity
      : opacity;

  return {
    mMenuIconColorPalette: isChanged === "hex" ? "" : v.mMenuIconColorPalette,
    mMenuIconColorHex: hex,
    mMenuIconColorOpacity: mMenuIconColorOpacity
  };
}

//Tablet
export function onChangeTabletColorHexIconMMenu2({
  v,
  hex,
  opacity,
  isChanged
}) {
  const tabletMMenuIconColorOpacity =
    hex !== v.tabletMMenuIconColorHex && v.tabletMMenuIconColorOpacity === 0
      ? v.mMenuTempIconColorOpacity
      : opacity;
  return {
    tabletMMenuIconColorHex: hex,
    tabletMMenuIconColorOpacity: tabletMMenuIconColorOpacity,
    tabletMMenuIconColorPalette:
      isChanged === "hex" ? "" : v.tabletMMenuIconColorPalette
  };
}

export function onChangeTabletColorPaletteIconMMenu2({ v, palette }) {
  return {
    tabletMMenuIconColorPalette: palette,
    tabletMMenuIconColorHex: "",
    tabletMMenuIconColorOpacity:
      v.tabletMMenuIconColorOpacity === 0
        ? v.mMenuTempIconColorOpacity
        : v.tabletMMenuIconColorOpacity
  };
}

export function onChangeTabletColorFieldsIconMMenu2({
  v,
  hex,
  opacity,
  isChanged
}) {
  const tabletMMenuIconColorOpacity =
    hex !== v.tabletMMenuIconColorHex && v.tabletMMenuIconColorOpacity === 0
      ? v.mMenuTempIconColorOpacity
      : opacity;
  return {
    tabletMMenuIconColorPalette:
      isChanged === "hex" ? "" : v.tabletMMenuIconColorPalette,
    tabletMMenuIconColorHex: hex,
    tabletMMenuIconColorOpacity: tabletMMenuIconColorOpacity
  };
}

//Mobile

export function onChangeMobileColorHexIconMMenu2({
  v,
  hex,
  opacity,
  isChanged
}) {
  const mobileMMenuIconColorOpacity =
    hex !== v.mobileMMenuIconColorHex && v.mobileMMenuIconColorOpacity === 0
      ? v.mMenuTempIconColorOpacity
      : opacity;
  return {
    mobileMMenuIconColorHex: hex,
    mobileMMenuIconColorOpacity: mobileMMenuIconColorOpacity,
    mobileMMenuIconColorPalette:
      isChanged === "hex" ? "" : v.mobileMMenuIconColorPalette
  };
}

export function onChangeMobileColorPaletteIconMMenu2({ v, palette }) {
  return {
    mobileMMenuIconColorPalette: palette,
    mobileMMenuIconColorHex: "",
    mobileMMenuIconColorOpacity:
      v.mobileMMenuIconColorOpacity === 0
        ? v.mMenuTempIconColorOpacity
        : v.mobileMMenuIconColorOpacity
  };
}

export function onChangeMobileColorFieldsIconMMenu2({
  v,
  hex,
  opacity,
  isChanged
}) {
  const mobileMMenuIconColorOpacity =
    hex !== v.mobileMMenuIconColorHex && v.mobileMMenuIconColorOpacity === 0
      ? v.mMenuTempIconColorOpacity
      : opacity;
  return {
    mobileMMenuIconColorPalette:
      isChanged === "hex" ? "" : v.mobileMMenuIconColorPalette,
    mobileMMenuIconColorHex: hex,
    mobileMMenuIconColorOpacity: mobileMMenuIconColorOpacity
  };
}

// mMenuBgColor
export function onChangeBgColorHexMMenu2({
  v,
  hex,
  opacity,
  isChanged,
  opacityDragEnd
}) {
  opacity =
    hex !== v.mMenuBgColorHex && v.mMenuBgColorOpacity == 0
      ? v.mMenuTempBgColorOpacity
      : opacity;

  return {
    mMenuBgColorHex: hex,
    mMenuBgColorOpacity: opacity,
    mMenuBgColorPalette: isChanged === "hex" ? "" : v.mMenuBgColorPalette,

    // Temporary Value changes
    mMenuTempBgColorOpacity:
      opacity > 0 && opacityDragEnd ? opacity : v.mMenuTempBgColorOpacity
  };
}

export function onChangeBgColorPaletteMMenu2({ v, palette }) {
  return {
    mMenuBgColorPalette: palette,

    mMenuBgColorOpacity:
      v.mMenuBgColorOpacity === 0
        ? v.mMenuTempBgColorOpacity
        : v.mMenuBgColorOpacity
  };
}

export function onChangeBgColorFieldsMMenu2({ v, hex, opacity, isChanged }) {
  return {
    mMenuBgColorPalette: isChanged === "hex" ? "" : v.mMenuBgColorPalette,
    mMenuBgColorHex: hex,
    mMenuBgColorOpacity: opacity
  };
}

// subMenuBgColor
export function onChangeBgColorHexSubMenu2({
  v,
  hex,
  opacity,
  isChanged,
  opacityDragEnd = false
}) {
  opacity =
    hex !== v.subMenuBgColorHex && v.subMenuBgColorOpacity === 0
      ? v.subMenuTempBgColorOpacity
      : opacity;

  return {
    subMenuBgColorHex: hex,
    subMenuBgColorOpacity: opacity,
    subMenuBgColorPalette: isChanged === "hex" ? "" : v.subMenuBgColorPalette,

    // Temporary Value chnges
    subMenuTempBgColorOpacity:
      opacity > 0 && opacityDragEnd ? opacity : v.subMenuTempBgColorOpacity,

    // Normal + Hover Sync
    subMenuHoverBgColorHex:
      v.subMenuBgColorHex === v.subMenuHoverBgColorHex
        ? hex
        : v.subMenuHoverBgColorHex,

    subMenuHoverBgColorOpacity:
      v.subMenuBgColorOpacity === v.subMenuHoverBgColorOpacity
        ? hex
        : v.subMenuHoverBgColorOpacity,

    // Sync MMenu
    mMenuBgColorHex:
      v.subMenuBgColorHex === v.mMenuBgColorHex ? hex : v.mMenuBgColorHex,
    mMenuBgColorOpacity:
      v.subMenuBgColorOpacity === v.mMenuBgColorOpacity
        ? opacity
        : v.mMenuBgColorOpacity
  };
}

export function onChangeBgColorPaletteSubMenu2({ v, palette }) {
  return {
    subMenuBgColorPalette: palette,

    subMenuBgColorOpacity:
      v.subMenuBgColorOpacity === 0
        ? v.subMenuTempBgColorOpacity
        : v.subMenuBgColorOpacity,

    // Normal + Hover Sync
    subMenuHoverBgColorPalette:
      v.subMenuBgColorPalette === v.subMenuHoverBgColorPalette
        ? palette
        : v.subMenuHoverBgColorPalette,

    // Sync MMenu
    mMenuBgColorPalette:
      v.subMenuBgColorPalette === v.mMenuBgColorPalette
        ? palette
        : v.mMenuBgColorPalette
  };
}

export function onChangeBgColorFieldsSubMenu2({ v, hex, opacity, isChanged }) {
  return {
    subMenuBgColorPalette: isChanged === "hex" ? "" : v.subMenuBgColorPalette,
    subMenuBgColorHex: hex,
    subMenuBgColorOpacity: opacity,

    subMenuHoverBgColorHex:
      v.subMenuBgColorHex === v.subMenuHoverBgColorHex
        ? hex
        : v.subMenuHoverBgColorHex,

    subMenuHoverBgColorOpacity:
      v.subMenuBgColorOpacity === v.subMenuHoverBgColorOpacity
        ? hex
        : v.subMenuHoverBgColorOpacity,

    // Sync MMenu
    mMenuBgColorHex:
      v.subMenuBgColorHex === v.mMenuBgColorHex ? hex : v.mMenuBgColorHex,
    mMenuBgColorOpacity:
      v.subMenuBgColorOpacity === v.mMenuBgColorOpacity
        ? opacity
        : v.mMenuBgColorOpacity
  };
}

// subMenuHoverBgColor
export function onChangeBgHoverColorHexSubMenu2({
  v,
  hex,
  opacity,
  isChanged
}) {
  return {
    subMenuHoverBgColorHex: hex,
    subMenuHoverBgColorOpacity:
      hex !== v.subMenuHoverBgColorHex && v.subMenuHoverBgColorOpacity === 0
        ? v.subMenuTempHoverBgColorOpacity
        : opacity,
    subMenuHoverBgColorPalette:
      isChanged === "hex" ? "" : v.subMenuHoverBgColorPalette
  };
}

export function onChangeBgHoverColorPaletteSubMenu2({ v, palette }) {
  return {
    subMenuHoverBgColorPalette: palette,
    subMenuHoverBgColorOpacity:
      v.subMenuHoverBgColorOpacity === 0
        ? v.subMenuTempHoverBgColorOpacity
        : v.subMenuHoverBgColorOpacity
  };
}

export function onChangeBgHoverColorFieldsSubMenu2({
  v,
  hex,
  opacity,
  isChanged
}) {
  return {
    subMenuHoverBgColorPalette:
      isChanged === "hex" ? "" : v.subMenuHoverBgColorPalette,
    subMenuHoverBgColorHex: hex,
    subMenuHoverBgColorOpacity: opacity
  };
}

// mMenuBorderColor
export function onChangeBorderColorHexMMenu2({
  v,
  hex,
  opacity,
  isChanged,
  opacityDragEnd
}) {
  opacity =
    hex !== v.mMenuBorderColorHex && v.mMenuBorderColorOpacity == 0
      ? v.mMenuTempBorderColorOpacity
      : opacity;
  return {
    mMenuBorderColorHex: hex,
    mMenuBorderColorOpacity: opacity,
    mMenuBorderColorPalette:
      isChanged === "hex" ? "" : v.mMenuBorderColorPalette,

    // Temporary Value changes
    mMenuTempBorderColorOpacity:
      opacity > 0 && opacityDragEnd ? opacity : v.mMenuTempBorderColorOpacity
  };
}

export function onChangeBorderColorPaletteMMenu2({ v, palette }) {
  return {
    mMenuBorderColorPalette: palette,

    mMenuBorderColorOpacity:
      v.mMenuBorderColorOpacity === 0
        ? v.mMenuTempBorderColorOpacity
        : v.mMenuBorderColorOpacity
  };
}

export function onChangeBorderColorFieldsMMenu2({
  v,
  hex,
  opacity,
  isChanged
}) {
  return {
    mMenuBorderColorPalette:
      isChanged === "hex" ? "" : v.mMenuBorderColorPalette,

    mMenuBorderColorHex: hex,
    mMenuBorderColorOpacity: opacity
  };
}

// subMenuBorderColor
export function onChangeBorderColorHexSubMenu2({
  v,
  hex,
  opacity,
  isChanged,
  opacityDragEnd
}) {
  opacity =
    hex !== v.subMenuBorderColorHex && v.subMenuBorderColorOpacity === 0
      ? v.subMenuTempBorderColorOpacity
      : opacity;

  return {
    subMenuBorderColorHex: hex,
    subMenuBorderColorOpacity: opacity,
    subMenuBorderColorPalette:
      isChanged === "hex" ? "" : v.subMenuBorderColorPalette,

    // Temporary Value chnges
    subMenuTempBorderColorOpacity:
      opacity > 0 && opacityDragEnd ? opacity : v.subMenuTempBorderColorOpacity,

    // Sync MMenu
    mMenuBorderColorHex:
      v.subMenuBorderColorHex === v.mMenuBorderColorHex
        ? hex
        : v.mMenuBorderColorHex,
    mMenuBorderColorOpacity:
      v.subMenuBorderColorOpacity === v.mMenuBorderColorOpacity
        ? opacity
        : v.mMenuBorderColorOpacity
  };
}

export function onChangeBorderColorPaletteSubMenu2({ v, palette }) {
  return {
    subMenuBorderColorPalette: palette,

    subMenuBorderColorOpacity:
      v.subMenuBorderColorOpacity === 0
        ? v.subMenuTempBorderColorOpacity
        : v.subMenuBorderColorOpacity,

    // Sync MMenu
    mMenuBorderColorPalette:
      v.subMenuBorderColorPalette === v.mMenuBorderColorPalette
        ? palette
        : v.mMenuBorderColorPalette
  };
}

export function onChangeBorderColorFieldsSubMenu2({
  v,
  hex,
  opacity,
  isChanged
}) {
  return {
    subMenuBorderColorPalette:
      isChanged === "hex" ? "" : v.subMenuBorderColorPalette,
    subMenuBorderColorHex: hex,
    subMenuBorderColorOpacity: opacity,

    // Sync MMenu
    mMenuBorderColorHex:
      v.subMenuBorderColorHex === v.mMenuBorderColorHex
        ? hex
        : v.mMenuBorderColorHex,
    mMenuBorderColorOpacity:
      v.subMenuBorderColorOpacity === v.mMenuBorderColorOpacity
        ? opacity
        : v.mMenuBorderColorOpacity
  };
}
