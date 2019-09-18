export function onChangeColorHexButtonIcon2({
  v,
  hex,
  opacity,
  isChanged,
  opacityDragEnd
}) {
  opacity =
    hex !== v.colorHex && v.colorOpacity == 0 ? v.tempColorOpacity : opacity;

  return {
    colorHex: hex,
    colorOpacity: opacity,
    colorPalette: isChanged === "hex" ? "" : v.colorPalette,

    // Temporary Value chnges
    tempColorOpacity:
      opacity > 0 && opacityDragEnd ? opacity : v.tempColorOpacity,

    // Normal + Hover Sync
    hoverColorHex: v.colorHex === v.hoverColorHex ? hex : v.hoverColorHex,

    hoverColorOpacity:
      v.colorOpacity === v.hoverColorOpacity ? opacity : v.hoverColorOpacity
  };
}

export function onChangeColorPaletteButtonIcon2({ v, palette }) {
  return {
    colorPalette: palette,

    colorOpacity: v.colorOpacity === 0 ? v.tempColorOpacity : v.colorOpacity
  };
}

export function onChangeColorFieldsButtonIcon2({ v, hex, opacity, isChanged }) {
  return {
    colorPalette: isChanged === "hex" ? "" : v.colorPalette,
    colorHex: hex,
    colorOpacity: opacity
  };
}

export function onChangeHoverColorHexButtonIcon2({
  v,
  hex,
  opacity,
  isChanged
}) {
  return {
    hoverColorHex: hex,
    hoverColorOpacity:
      hex !== v.hoverColorHex && v.hoverColorOpacity == 0
        ? v.tempHoverColorOpacity
        : opacity,
    hoverColorPalette: isChanged === "hex" ? "" : v.hoverColorPalette
  };
}

export function onChangeHoverColorPaletteButtonIcon2({ v, palette }) {
  return {
    hoverColorPalette: palette,

    hoverColorOpacity:
      v.hoverColorOpacity === 0 ? v.tempHoverColorOpacity : v.hoverColorOpacity
  };
}

export function onChangeHoverColorFieldsButtonIcon2({
  v,
  hex,
  opacity,
  isChanged
}) {
  return {
    hoverColorPalette: isChanged === "hex" ? "" : v.hoverColorPalette,
    hoverColorHex: hex,
    hoverColorOpacity: opacity
  };
}
