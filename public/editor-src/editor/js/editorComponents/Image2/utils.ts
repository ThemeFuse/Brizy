import { clamp, roundTo } from "visual/utils/math";
import { ImageSize } from "./types";

type V = {
  imageWidth: number;
  imageHeight: number;
  width: number;
  height: number;
  zoom: number;
  positionX: number;
  positionY: number;
  widthSuffix: "px" | "%";
  heightSuffix: "px" | "%";
};

type WrapperSizes = {
  width: number;
  height: number;
};

type Sizes = {
  imgWidth: number;
  imgHeight: number;
  imgMarginWidth: number;
  imgMarginHeight: number;
  wrapperWidth: number;
  wrapperHeight: number;
  positionX: number;
  positionY: number;
};

type ImageMargin = {
  top: number;
  left: number;
};

const calcImageMargin = (sizes: Sizes, isPreview: boolean): ImageMargin => {
  let mL, mH;

  const ratioX = sizes.positionX;
  const ratioY = sizes.positionY;

  const maxWidth = sizes.imgWidth - sizes.wrapperWidth;
  const maxHeight = sizes.imgHeight - sizes.wrapperHeight;

  const x1 = (ratioX * sizes.imgWidth) / 100;
  const y1 = (ratioY * sizes.imgHeight) / 100;

  mL = x1 - sizes.wrapperWidth / 2;
  mH = y1 - sizes.wrapperHeight / 2;

  if (sizes.imgWidth > sizes.wrapperWidth) {
    if (mL < 0) {
      mL = 0;
    }

    if (mL > maxWidth) {
      mL = maxWidth;
    }
  } else {
    mL = isPreview ? 0 : maxWidth / 2;
  }

  if (sizes.imgHeight > sizes.wrapperHeight) {
    if (mH < 0) {
      mH = 0;
    }

    if (mH > maxHeight) {
      mH = maxHeight;
    }
  } else {
    mH = isPreview ? 0 : maxHeight / 2;
  }

  return {
    left: -mL,
    top: -mH
  };
};

export const calcWrapperSizes = (v: V, cW: number): WrapperSizes => {
  const cH = cW / (v.imageWidth / v.imageHeight);

  let width = clamp(v.width || cW, 0, cW);
  let height = v.height || cH;

  if (v.widthSuffix === "%") {
    width = (v.width * cW) / 100;
  }

  if (v.heightSuffix === "%") {
    const newcH = width / (v.imageWidth / v.imageHeight);
    height = (v.height * newcH) / 100;
  }

  return { width: roundTo(width, 2), height: roundTo(height, 2) };
};

export const calcImageSizes = (
  v: V,
  cW: number,
  isPreview = false
): ImageSize => {
  const wrapperSizes = calcWrapperSizes(v, cW);

  let heightCoefficient = 1;
  let widthCoefficient = 1;
  if (v.imageWidth / wrapperSizes.width < v.imageHeight / wrapperSizes.height) {
    widthCoefficient = roundTo(wrapperSizes.width / v.imageWidth, 8);
  } else {
    heightCoefficient = roundTo(wrapperSizes.height / v.imageHeight, 8);
  }

  const imgWidth = roundTo(
    v.imageWidth * (v.zoom / 100) * widthCoefficient * heightCoefficient,
    2
  );
  const imgHeight = roundTo(
    v.imageHeight * (v.zoom / 100) * widthCoefficient * heightCoefficient,
    2
  );
  const containerWidth = roundTo(wrapperSizes.width * (v.zoom / 100), 2);
  const containerHeight = roundTo(wrapperSizes.height * (v.zoom / 100), 2);
  const imgMarginWidth = imgWidth - containerWidth;
  const imgMarginHeight = imgHeight - containerHeight;

  const sizes = {
    imgWidth: imgWidth,
    imgHeight: imgHeight,
    imgMarginWidth: imgMarginWidth,
    imgMarginHeight: imgMarginHeight,
    wrapperWidth: wrapperSizes.width,
    wrapperHeight: wrapperSizes.height,
    positionX: v.positionX,
    positionY: v.positionY
  };
  const margin = calcImageMargin(sizes, isPreview);

  return {
    width: roundTo(sizes.imgWidth, 2),
    height: roundTo(sizes.imgHeight, 2),
    marginLeft: roundTo(margin.left, 2),
    marginTop: roundTo(margin.top, 2)
  };
};

export const isSVG = (extension: string): boolean => extension === "svg";
export const isGIF = (extension: string): boolean => extension === "gif";
