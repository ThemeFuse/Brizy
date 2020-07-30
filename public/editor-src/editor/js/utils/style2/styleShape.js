import { defaultValueValue } from "visual/utils/onChange";
import { hexToRgba } from "visual/utils/color";
import { svgToUri } from "visual/utils/icons";
import { getOptionColorHexByPalette } from "visual/utils/options";

export function styleShapeTopType({ v, device, state }) {
  return defaultValueValue({ v, key: "shapeTopType", device, state });
}

export function styleShapeTopSvg({ v, device, state }) {
  const { hex: shapeTopColorHex } = getOptionColorHexByPalette(
    defaultValueValue({ v, key: "shapeTopColorHex", device, state }),
    defaultValueValue({ v, key: "shapeTopColorPalette", device, state })
  );

  const shapeTopColorOpacity = defaultValueValue({
    v,
    key: "shapeTopColorOpacity",
    device,
    state
  });

  const shapeTopType = defaultValueValue({
    v,
    key: "shapeTopType",
    device,
    state
  });

  return svgToUri(
    shapeTopType,
    hexToRgba(shapeTopColorHex, shapeTopColorOpacity)
  );
}

export function styleShapeTopHeight({ v, device, state }) {
  return defaultValueValue({ v, key: "shapeTopHeight", device, state });
}

export function styleShapeTopHeightSuffix({ v, device, state }) {
  return defaultValueValue({ v, key: "shapeTopHeightSuffix", device, state });
}

export function styleShapeTopFlip({ v, device, state }) {
  return defaultValueValue({ v, key: "shapeTopHorizontal", device, state });
}

export function styleShapeTopIndex({ v, device, state }) {
  return defaultValueValue({ v, key: "shapeTopIndex", device, state });
}

export function styleShapeBottomType({ v, device, state }) {
  return defaultValueValue({ v, key: "shapeBottomType", device, state });
}

export function styleShapeBottomSvg({ v, device, state }) {
  const { hex: shapeBottomColorHex } = getOptionColorHexByPalette(
    defaultValueValue({ v, key: "shapeBottomColorHex", device, state }),
    defaultValueValue({ v, key: "shapeBottomColorPalette", device, state })
  );
  const shapeBottomColorOpacity = defaultValueValue({
    v,
    key: "shapeBottomColorOpacity",
    device,
    state
  });
  const shapeBottomType = defaultValueValue({
    v,
    key: "shapeBottomType",
    device,
    state
  });

  return svgToUri(
    shapeBottomType,
    hexToRgba(shapeBottomColorHex, shapeBottomColorOpacity)
  );
}

export function styleShapeBottomHeight({ v, device, state }) {
  return defaultValueValue({ v, key: "shapeBottomHeight", device, state });
}

export function styleShapeBottomHeightSuffix({ v, device, state }) {
  return defaultValueValue({
    v,
    key: "shapeBottomHeightSuffix",
    device,
    state
  });
}

export function styleShapeBottomFlip({ v, device, state }) {
  return defaultValueValue({ v, key: "shapeBottomHorizontal", device, state });
}

export function styleShapeBottomIndex({ v, device, state }) {
  return defaultValueValue({ v, key: "shapeBottomIndex", device, state });
}
