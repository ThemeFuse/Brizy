export function onChangeElementIconBorderColorHex2({
  v,
  hex,
  opacity = undefined,
  isChanged = "hex"
}) {
  opacity =
    hex !== v.borderColorHex && v.borderColorOpacity === 0
      ? v.tempBorderColorOpacity
      : opacity;

  return {
    borderColorHex: hex,

    borderColorOpacity: opacity,

    borderColorPalette: isChanged === "hex" ? "" : v.borderColorPalette,

    tempBorderColorOpacity: opacity > 0 ? opacity : v.tempBorderColorOpacity,

    tempBorderColorPalette: isChanged === "hex" ? "" : v.tempBorderColorPalette,

    padding:
      opacity === 0 && v.bgColorOpacity === 0
        ? 0
        : opacity > 0
        ? v.tempPadding
        : v.padding,

    borderRadiusType:
      opacity === 0 && v.bgColorOpacity === 0
        ? ""
        : opacity > 0
        ? v.tempBorderRadiusType
        : v.borderRadiusType,

    fillType:
      opacity === 0 && v.bgColorOpacity === 0
        ? "default"
        : opacity > 0 && v.bgColorOpacity === 0
        ? "outline"
        : v.fillType,

    borderWidth:
      opacity === 0 ? 0 : opacity > 0 ? v.tempBorderWidth : v.borderWidth,

    bgColorOpacity:
      opacity > 0 && v.bgColorOpacity > 0
        ? v.tempBgColorOpacity
        : v.bgColorOpacity,

    // Normal + Hover Sync
    hoverBgColorHex:
      v.bgColorHex === v.hoverBgColorHex ? hex : v.hoverBgColorHex,

    hoverBgColorOpacity:
      opacity === 0 && v.bgColorOpacity === 0
        ? 0
        : v.bgColorOpacity === v.hoverBgColorOpacity
        ? opacity
        : v.hoverBgColorOpacity
  };
}

export function onChangeElementIconBorderColorPalette2({ v, palette }) {
  return {
    borderColorPalette: palette,

    tempBorderColorPalette: palette,

    borderColorOpacity:
      v.borderColorOpacity === 0
        ? v.tempBorderColorOpacity
        : v.borderColorOpacity,

    padding: v.tempPadding,

    borderRadiusType: v.tempBorderRadiusType,

    fillType:
      v.bgColorOpacity === 0
        ? "outline"
        : v.bgColorOpacity > 0
        ? "filled"
        : v.fillType,

    borderWidth: v.tempBorderWidth
  };
}

export function onChangeElementIconBorderColorFields2({
  v,
  hex,
  opacity,
  isChanged
}) {
  return {
    borderColorPalette: isChanged === "hex" ? "" : v.borderColorPalette,

    borderColorHex: hex,

    borderColorOpacity: opacity
  };
}

export function onChangeElementIconBorderHoverColorHex2({
  v,
  hex,
  opacity = undefined,
  isChanged = "hex"
}) {
  return {
    hoverBorderColorHex: hex,

    hoverBorderColorOpacity:
      hex !== v.hoverBorderColorHex && v.hoverBorderColorOpacity == 0
        ? v.tempHoverBorderColorOpacity
        : opacity,

    hoverBorderColorPalette:
      isChanged === "hex" ? "" : v.hoverBorderColorPalette
  };
}

export function onChangeElementIconBorderHoverColorPalette2({ v, palette }) {
  return {
    hoverBorderColorPalette: palette,

    hoverBorderColorOpacity:
      v.hoverBorderColorOpacity === 0
        ? v.tempHoverBorderColorOpacity
        : v.hoverBorderColorOpacity
  };
}

export function onChangeElementIconBorderHoverColorFields2({
  v,
  hex,
  opacity,
  isChanged
}) {
  return {
    hoverBorderColorPalette:
      isChanged === "hex" ? "" : v.hoverBorderColorPalette,
    hoverBorderColorHex: hex,
    hoverBorderColorOpacity: opacity
  };
}
