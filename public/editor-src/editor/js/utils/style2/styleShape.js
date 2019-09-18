import { defaultValueValue } from "visual/utils/onChange";
import { hexToRgba } from "visual/utils/color";
import { svgToUri } from "visual/utils/icons";
import { getOptionColorHexByPalette } from "visual/utils/options";

export function styleShapeTopType({ v, device, state }) {
  return defaultValueValue({ v, key: "shapeTopType", device, state });
}

export function styleShapeTopSvg({ v, device, state }) {
  const { hex: shapeTopColorHex } = getOptionColorHexByPalette(
    defaultValueValue({ v, key: `shapeTopColorHex`, device, state }),
    defaultValueValue({ v, key: `shapeTopColorPalette`, device, state })
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

export function styleShapeTopHeight({ v, device }) {
  return defaultValueValue({ v, key: "shapeTopHeight", device });
}

export function styleShapeTopHeightSuffix({ v, device }) {
  return defaultValueValue({ v, key: "shapeTopHeightSuffix", device });
}

export function styleShapeTopFlip({ v }) {
  const { shapeTopHorizontal } = v;
  return shapeTopHorizontal;
}

export function styleShapeTopIndex({ v }) {
  const { shapeTopIndex } = v;
  return shapeTopIndex;
}

export function styleShapeBottomType({ v, device, state }) {
  return defaultValueValue({ v, key: "shapeBottomType", device, state });
}

export function styleShapeBottomSvg({ v, device, state }) {
  const { hex: shapeBottomColorHex } = getOptionColorHexByPalette(
    defaultValueValue({ v, key: `shapeBottomColorHex`, device, state }),
    defaultValueValue({ v, key: `shapeBottomColorPalette`, device, state })
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

export function styleShapeBottomHeight({ v, device }) {
  return defaultValueValue({ v, key: "shapeBottomHeight", device });
}

export function styleShapeBottomHeightSuffix({ v, device }) {
  return defaultValueValue({ v, key: "shapeBottomHeightSuffix", device });
}

export function styleShapeBottomFlip({ v }) {
  const { shapeBottomHorizontal } = v;
  return shapeBottomHorizontal;
}

export function styleShapeBottomIndex({ v }) {
  const { shapeBottomIndex } = v;
  return shapeBottomIndex;
}
