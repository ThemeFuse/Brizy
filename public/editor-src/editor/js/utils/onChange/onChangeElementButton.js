export function onChangeElementButtonBorderColorHex2({
  v,
  hex,
  opacity = undefined,
  isChanged = "hex",
  opacityDragEnd = false
}) {
  opacity =
    hex !== v.borderColorHex && v.borderColorOpacity === 0
      ? v.tempBorderColorOpacity
      : opacity;
  return {
    borderColorHex: hex,
    borderColorOpacity: opacity,
    tempBorderColorOpacity:
      opacity > 0 && opacityDragEnd ? opacity : v.tempBorderColorOpacity,

    borderColorPalette: isChanged === "hex" ? "" : v.borderColorPalette,

    tempBorderColorPalette: isChanged === "hex" ? "" : v.tempBorderColorPalette,

    paddingRL:
      opacity === 0 && v.bgColorOpacity === 0
        ? 0
        : opacity > 0
        ? v.tempPaddingRL
        : v.paddingRL,

    paddingRight:
      opacity === 0 && v.bgColorOpacity === 0
        ? 0
        : opacity > 0
        ? v.tempPaddingRight
        : v.paddingRight,

    paddingLeft:
      opacity === 0 && v.bgColorOpacity === 0
        ? 0
        : opacity > 0
        ? v.tempPaddingLeft
        : v.paddingRight,

    paddingTB:
      opacity === 0 && v.bgColorOpacity === 0 ? v.tempPaddingTB : v.paddingTB,

    paddingTop:
      opacity === 0 && v.bgColorOpacity === 0 ? v.tempPaddingTop : v.paddingTop,

    paddingBottom:
      opacity === 0 && v.bgColorOpacity === 0
        ? v.tempPaddingBottom
        : v.paddingBottom,

    fillType:
      opacity === 0 && v.bgColorOpacity === 0
        ? "default"
        : opacity > 0 && v.bgColorOpacity === 0
        ? "outline"
        : v.fillType,

    borderRadiusType:
      opacity === 0 && v.bgColorOpacity === 0
        ? ""
        : opacity > 0
        ? v.tempBorderRadiusType
        : v.borderRadiusType,

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

export function onChangeElementButtonBorderColorPalette2({ v, palette }) {
  return {
    borderColorPalette: palette,

    tempBorderColorPalette: palette,

    borderColorOpacity:
      v.borderColorOpacity === 0
        ? v.tempBorderColorOpacity
        : v.borderColorOpacity,

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

export function onChangeElementButtonBorderColorFields2({
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

export function onChangeElementButtonBorderHoverColorHex2({
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

export function onChangeElementButtonBorderHoverColorPalette2({ v, palette }) {
  return {
    hoverBorderColorPalette: palette,

    hoverBorderColorOpacity:
      v.hoverBorderColorOpacity === 0
        ? v.tempHoverBorderColorOpacity
        : v.hoverBorderColorOpacity
  };
}

export function onChangeElementButtonBorderHoverColorFields2({
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

export function onChangeBgColorHexButton2({
  v,
  hex,
  opacity = undefined,
  isChanged = "hex",
  opacityDragEnd = false
}) {
  opacity =
    hex !== v.bgColorHex && v.bgColorOpacity === 0
      ? v.tempBgColorOpacity
      : opacity;

  return {
    bgColorHex: hex,
    bgColorOpacity: opacity,
    bgColorPalette: isChanged === "hex" ? "" : v.bgColorPalette,

    tempBgColorPalette: isChanged === "hex" ? "" : v.tempBgColorPalette,

    tempBgColorOpacity:
      opacity > 0 && opacityDragEnd ? opacity : v.tempBgColorOpacity,

    borderRadiusType:
      opacity === 0 && v.borderColorOpacity === 0
        ? ""
        : opacity > 0
        ? v.tempBorderRadiusType
        : v.borderRadiusType,

    fillType:
      opacity === 0 && v.borderColorOpacity === 0
        ? "default"
        : opacity === 0 && v.borderColorOpacity > 0
        ? "outline"
        : opacity > 0
        ? "filled"
        : v.fillType,

    borderWidth:
      opacity === 0 && v.borderColorOpacity === 0 ? 0 : v.borderWidth,

    borderColorHex:
      v.bgColorPalette !== "" &&
      v.bgColorPalette === v.borderColorPalette &&
      v.fillType === "filled"
        ? hex
        : v.bgColorPalette === "" &&
          v.bgColorHex === v.borderColorHex &&
          v.fillType === "filled"
        ? hex
        : v.borderColorHex,

    borderColorPalette:
      v.bgColorPalette !== "" &&
      v.bgColorPalette === v.borderColorPalette &&
      v.fillType === "filled"
        ? ""
        : v.borderColorPalette,

    tempBorderColorPalette:
      v.bgColorPalette !== "" &&
      v.bgColorPalette === v.borderColorPalette &&
      v.fillType === "filled"
        ? ""
        : v.tempBorderColorPalette,

    borderColorOpacity:
      v.bgColorPalette === "" &&
      v.bgColorHex === v.borderColorHex &&
      v.bgColorOpacity === v.tempBorderColorOpacity &&
      v.fillType === "filled"
        ? 0
        : opacity === 0 && v.borderColorOpacity === 0
        ? 0
        : v.borderColorOpacity,

    // Normal + Hover Sync
    hoverBgColorOpacity:
      opacity === 0 && v.borderColorOpacity === 0
        ? 0
        : opacity > 0
        ? v.tempHoverBgColorOpacity
        : v.hoverBgColorOpacity,

    hoverBorderColorHex:
      v.borderColorHex === v.hoverBorderColorHex ? hex : v.hoverBorderColorHex,

    hoverBorderColorOpacity:
      opacity === 0 && v.bgColorOpacity === 0 ? 0 : v.hoverBorderColorOpacity
  };
}

export function onChangeBgColorPaletteButton2({ v, palette }) {
  return {
    bgColorPalette: palette,

    tempBgColorPalette: palette,

    bgColorOpacity:
      v.bgColorOpacity === 0 ? v.tempBgColorOpacity : v.bgColorOpacity,

    borderRadiusType: v.tempBorderRadiusType,

    fillType: "filled",

    borderColorPalette:
      v.bgColorPalette !== "" &&
      v.bgColorPalette === v.borderColorPalette &&
      v.fillType === "filled"
        ? palette
        : v.bgColorPalette === "" &&
          v.bgColorHex === v.borderColorHex &&
          v.fillType === "filled"
        ? palette
        : v.borderColorPalette,

    tempBorderColorPalette:
      v.bgColorPalette !== "" &&
      v.bgColorPalette === v.borderColorPalette &&
      v.fillType === "filled"
        ? palette
        : v.bgColorPalette === "" &&
          v.bgColorHex === v.borderColorHex &&
          v.fillType === "filled"
        ? palette
        : v.borderColorPalette,

    // Normal + Hover Sync
    hoverBgColorOpacity: v.tempHoverBgColorOpacity
  };
}

export function onChangeBgColorFieldsButton2({ v, hex, opacity, isChanged }) {
  return {
    bgColorPalette: isChanged === "hex" ? "" : v.bgColorPalette,

    bgColorHex: hex,

    bgColorOpacity: opacity
  };
}

export function onChangeHoverBgColorHexButton2({
  v,
  hex,
  opacity = undefined,
  isChanged = "hex",
  opacityDragEnd = false
}) {
  opacity =
    hex !== v.hoverBgColorHex && v.hoverBgColorOpacity === 0
      ? v.tempHoverBgColorOpacity
      : opacity;

  return {
    hoverBgColorHex: hex,

    hoverBgColorOpacity: opacity,

    tempHoverBgColorOpacity:
      opacity > 0 && opacityDragEnd ? opacity : v.tempHoverBgColorOpacity,

    hoverBgColorPalette: isChanged === "hex" ? "" : v.hoverBgColorPalette,

    tempHoverBgColorPalette:
      isChanged === "hex" ? "" : v.tempHoverBgColorPalette,

    hoverBorderColorHex:
      v.hoverBgColorPalette !== "" &&
      v.hoverBgColorPalette === v.hoverBorderColorPalette &&
      v.fillType === "filled"
        ? hex
        : v.hoverBgColorPalette === "" &&
          v.hoverBgColorHex === v.hoverBorderColorHex &&
          v.fillType === "filled"
        ? hex
        : v.hoverBorderColorHex,

    hoverBorderColorPalette:
      v.hoverBgColorPalette !== "" &&
      v.hoverBgColorPalette === v.hoverBorderColorPalette &&
      v.fillType === "filled"
        ? ""
        : v.hoverBorderColorPalette,

    tempHoverBorderColorPalette:
      v.hoverBgColorPalette !== "" &&
      v.hoverBgColorPalette === v.hoverBorderColorPalette &&
      v.fillType === "filled"
        ? ""
        : v.tempHoverBorderColorPalette,

    hoverBorderColorOpacity:
      v.hoverBgColorPalette === "" &&
      v.hoverBgColorHex === v.hoverBorderColorHex &&
      v.hoverBgColorOpacity === v.tempHoverBorderColorOpacity &&
      v.fillType === "filled"
        ? 0
        : v.hoverBorderColorOpacity
  };
}

export function onChangeHoverBgColorPaletteButton2({ v, palette }) {
  return {
    hoverBgColorPalette: palette,

    hoverBgColorOpacity:
      v.hoverBgColorOpacity === 0
        ? v.tempHoverBgColorOpacity
        : v.hoverBgColorOpacity,

    hoverBorderColorPalette:
      v.hoverBgColorPalette !== "" &&
      v.hoverBgColorPalette === v.hoverBorderColorPalette &&
      v.fillType === "filled"
        ? palette
        : v.hoverBgColorPalette === "" &&
          v.hoverBgColorHex === v.hoverBorderColorHex &&
          v.fillType === "filled"
        ? palette
        : v.hoverBorderColorPalette,

    tempHoverBorderColorPalette:
      v.hoverBgColorPalette !== "" &&
      v.hoverBgColorPalette === v.hoverBorderColorPalette &&
      v.fillType === "filled"
        ? palette
        : v.hoverBgColorPalette === "" &&
          v.hoverBgColorHex === v.hoverBorderColorHex &&
          v.fillType === "filled"
        ? palette
        : v.hoverBorderColorPalette
  };
}

export function onChangeHoverBgColorFieldsButton2({
  v,
  hex,
  opacity,
  isChanged
}) {
  return {
    hoverBgColorPalette: isChanged === "hex" ? "" : v.hoverBgColorPalette,
    hoverBgColorHex: hex,
    hoverBgColorOpacity: opacity
  };
}
