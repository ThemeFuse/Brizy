import { defaultValueValue } from "visual/utils/onChange";
import { hexToRgba } from "visual/utils/color";
import { svgToUri } from "visual/utils/icons";

export function styleShapeTopType({ v }) {
  const { shapeTopType, shapeTopColorHex, shapeTopColorOpacity } = v;
  return shapeTopType === "none"
    ? "none"
    : `url('${svgToUri(
        shapeTopType,
        hexToRgba(shapeTopColorHex, shapeTopColorOpacity)
      )}')`;
}

export function styleShapeTopBackgroundSize({ v, device }) {
  return `100% ${defaultValueValue({
    v,
    key: "shapeTopHeight",
    device
  })}${defaultValueValue({ v, key: "shapeTopHeightSuffix", device })}`;
}

export function styleShapeTopFlip({ v }) {
  const { shapeTopHorizontal } = v;
  return shapeTopHorizontal === "on"
    ? "rotateX(0deg) rotateY(-180deg)"
    : "rotateX(0deg) rotateY(0deg)";
}

export function styleShapeTopHeight({ v, device }) {
  return `${defaultValueValue({
    v,
    key: "shapeTopHeight",
    device
  })}${defaultValueValue({ v, key: "shapeTopHeightSuffix", device })}`;
}

export function styleShapeTopIndex({ v }) {
  const { shapeTopIndex } = v;
  return shapeTopIndex;
}

export function styleShapeBottomType({ v }) {
  const { shapeBottomType, shapeBottomColorHex, shapeBottomColorOpacity } = v;
  return shapeBottomType === "none"
    ? "none"
    : `url('${svgToUri(
        shapeBottomType,
        hexToRgba(shapeBottomColorHex, shapeBottomColorOpacity)
      )}')`;
}

export function styleShapeBottomBackgroundSize({ v, device }) {
  return `100% ${defaultValueValue({
    v,
    key: "shapeBottomHeight",
    device
  })}${defaultValueValue({ v, key: "shapeBottomHeightSuffix", device })}`;
}

export function styleShapeBottomFlip({ v }) {
  const { shapeBottomHorizontal } = v;
  return shapeBottomHorizontal === "on"
    ? "rotateX(-180deg) rotateY(0deg)"
    : "rotateX(-180deg) rotateY(-180deg)";
}

export function styleShapeBottomHeight({ v, device }) {
  return `${defaultValueValue({
    v,
    key: "shapeBottomHeight",
    device
  })}${defaultValueValue({ v, key: "shapeBottomHeightSuffix", device })}`;
}

export function styleShapeBottomIndex({ v }) {
  const { shapeBottomIndex } = v;
  return shapeBottomIndex;
}
