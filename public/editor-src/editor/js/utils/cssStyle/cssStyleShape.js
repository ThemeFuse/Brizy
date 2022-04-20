import {
  styleShapeTopType,
  styleShapeTopSvg,
  styleShapeTopHeight,
  styleShapeTopHeightSuffix,
  styleShapeTopFlip,
  styleShapeTopIndex,
  styleShapeBottomType,
  styleShapeBottomSvg,
  styleShapeBottomHeight,
  styleShapeBottomHeightSuffix,
  styleShapeBottomFlip,
  styleShapeBottomIndex
} from "visual/utils/style2";
import { defaultValueValue } from "../onChange";

export function cssStyleShapeTopType({ v, device, state }) {
  const dvv = key => defaultValueValue({ v, key, device, state });
  const shapeTopType = styleShapeTopType({ v, device, state });
  const shapeTopSvg = styleShapeTopSvg({ v, device, state });
  const shapeTopColorPalette = dvv("shapeTopColorPalette");
  const shapeTopColorOpacity = dvv("shapeTopColorOpacity");

  const shape = shapeTopColorPalette
    ? `background-color: rgba(var(--brz-global-${shapeTopColorPalette}), ${shapeTopColorOpacity}); -webkit-mask-image: url("${shapeTopSvg}");-webkit-mask-size:100% 100%;`
    : `background-image: url(${shapeTopSvg});`;

  return shapeTopType === undefined
    ? ""
    : shapeTopType === "none"
    ? "background-image: none; -webkit-mask-image: none;"
    : shape;
}

export function cssStyleShapeTopHeight({ v, device, state }) {
  const shapeTopHeight = styleShapeTopHeight({ v, device, state });
  const shapeTopHeightSuffix = styleShapeTopHeightSuffix({ v, device, state });

  return `background-size: 100% ${shapeTopHeight}${shapeTopHeightSuffix}; height: ${shapeTopHeight}${shapeTopHeightSuffix};`;
}

export function cssStyleShapeTopFlip({ v, device, state }) {
  const shapeTopFlip = styleShapeTopFlip({ v, device, state });

  return `transform: ${
    shapeTopFlip === "on"
      ? "rotateX(0deg) rotateY(-180deg)"
      : "rotateX(0deg) rotateY(0deg)"
  };`;
}

export function cssStyleShapeTopIndex({ v, device, state }) {
  const shapeTopIndex = styleShapeTopIndex({ v, device, state });
  return `z-index: ${shapeTopIndex};`;
}

export function cssStyleShapeBottomType({ v, device, state }) {
  const dvv = key => defaultValueValue({ v, key, device, state });
  const shapeBottomType = styleShapeBottomType({ v, device, state });
  const shapeBottomSvg = styleShapeBottomSvg({ v, device, state });
  const shapeBottomColorPalette = dvv("shapeBottomColorPalette");
  const shapeBottomColorOpacity = dvv("shapeBottomColorOpacity");

  const shape = shapeBottomColorPalette
    ? `background-color: rgba(var(--brz-global-${shapeBottomColorPalette}), ${shapeBottomColorOpacity}); -webkit-mask-image: url("${shapeBottomSvg}");-webkit-mask-size:100% 100%;`
    : `background-image: url(${shapeBottomSvg});`;

  return shapeBottomType === undefined
    ? ""
    : shapeBottomType === "none"
    ? "background-image: none; -webkit-mask-image: none;"
    : shape;
}

export function cssStyleShapeBottomHeight({ v, device, state }) {
  const shapeBottomHeight = styleShapeBottomHeight({ v, device, state });
  const shapeBottomHeightSuffix = styleShapeBottomHeightSuffix({
    v,
    device,
    state
  });

  return `background-size: 100% ${shapeBottomHeight}${shapeBottomHeightSuffix}; height: ${shapeBottomHeight}${shapeBottomHeightSuffix};`;
}

export function cssStyleShapeBottomFlip({ v, device, state }) {
  const shapeBottomFlip = styleShapeBottomFlip({ v, device, state });

  return `transform: ${
    shapeBottomFlip === "on"
      ? "rotateX(-180deg) rotateY(0deg)"
      : "rotateX(-180deg) rotateY(-180deg)"
  };`;
}

export function cssStyleShapeBottomIndex({ v, device, state }) {
  const shapeBottomIndex = styleShapeBottomIndex({ v, device, state });
  return `z-index: ${shapeBottomIndex};`;
}
