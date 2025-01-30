import { configSelector } from "visual/redux/selectors";
import { makeStylePaletteCSSVar } from "visual/utils/color";
import {
  styleShapeBottomFlip,
  styleShapeBottomHeight,
  styleShapeBottomHeightSuffix,
  styleShapeBottomIndex,
  styleShapeBottomSvg,
  styleShapeBottomType,
  styleShapeTopFlip,
  styleShapeTopHeight,
  styleShapeTopHeightSuffix,
  styleShapeTopIndex,
  styleShapeTopSvg,
  styleShapeTopType
} from "visual/utils/style2";
import { defaultValueValue } from "../onChange";

export function cssStyleShapeTopType({ v, device, state, store }) {
  const dvv = (key) => defaultValueValue({ v, key, device, state });
  const shapeTopType = styleShapeTopType({ v, device, state });
  const shapeTopSvg = styleShapeTopSvg({ v, device, state });
  const shapeTopColorPalette = dvv("shapeTopColorPalette");
  const shapeTopColorOpacity = dvv("shapeTopColorOpacity");
  const config = configSelector(store.getState());

  const shape = shapeTopColorPalette
    ? `background-color: rgba(var(${makeStylePaletteCSSVar(
        shapeTopColorPalette,
        config
      )}), ${shapeTopColorOpacity}); -webkit-mask-image: url("${shapeTopSvg}");-webkit-mask-size:100% 100%;`
    : `background-image: url("${shapeTopSvg}");background-repeat: no-repeat;`;

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
      ? "scale(1.02) rotateX(0deg) rotateY(-180deg)"
      : "scale(1.02) rotateX(0deg) rotateY(0deg)"
  };`;
}

export function cssStyleShapeTopIndex({ v, device, state }) {
  const shapeTopIndex = styleShapeTopIndex({ v, device, state });
  return `z-index: ${shapeTopIndex};`;
}

export function cssStyleShapeBottomType({ v, device, state, store }) {
  const dvv = (key) => defaultValueValue({ v, key, device, state });
  const shapeBottomType = styleShapeBottomType({ v, device, state });
  const shapeBottomSvg = styleShapeBottomSvg({ v, device, state });
  const shapeBottomColorPalette = dvv("shapeBottomColorPalette");
  const shapeBottomColorOpacity = dvv("shapeBottomColorOpacity");
  const config = configSelector(store.getState());
  const shape = shapeBottomColorPalette
    ? `background-color: rgba(var(${makeStylePaletteCSSVar(
        shapeBottomColorPalette,
        config
      )}), ${shapeBottomColorOpacity}); -webkit-mask-image: url("${shapeBottomSvg}");-webkit-mask-size:100% 100%;`
    : `background-image: url("${shapeBottomSvg}");background-repeat: no-repeat;`;

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
      ? "scale(1.02) rotateX(-180deg) rotateY(0deg)"
      : "scale(1.02) rotateX(-180deg) rotateY(-180deg)"
  };`;
}

export function cssStyleShapeBottomIndex({ v, device, state }) {
  const shapeBottomIndex = styleShapeBottomIndex({ v, device, state });
  return `z-index: ${shapeBottomIndex};`;
}
