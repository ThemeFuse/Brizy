import Config from "visual/global/Config";
import * as Str from "visual/utils/string/specs";
import { clamp, roundTo } from "visual/utils/math";
import { ImageSize, Unit, V } from "./types";
import { ResponsiveMode } from "visual/utils/responsiveMode";
import { defaultValueValue } from "visual/utils/onChange";
import { placeholderObjFromStr } from "visual/editorComponents/EditorComponent/DynamicContent/utils";
import { isNullish } from "visual/utils/value";

export interface ImageValue {
  size: number;
  imageWidth: number;
  imageHeight: number;
  width: number;
  height: number;
  widthSuffix: Unit;
  heightSuffix: Unit;
}

interface Value extends ImageValue {
  zoom: number;
  positionX: number;
  positionY: number;
}

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

export interface PredefinedCustomSize {
  width: number;
  height: number;
  widthSuffix: Unit;
  heightSuffix: Unit;
}

type PredefinedOriginalSize = "original";

type CustomSize = "custom";

type ALLSizes = PredefinedCustomSize | PredefinedOriginalSize | CustomSize;

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

const DEFAULT_IMAGE_SIZES = {
  width: 1440,
  height: 960
};

export const calcWrapperSizes = (v: ImageValue, cW: number): WrapperSizes => {
  const imageWidth = v.imageWidth || DEFAULT_IMAGE_SIZES.width;
  const imageHeight = v.imageHeight || DEFAULT_IMAGE_SIZES.height;
  const cH = cW / (imageWidth / imageHeight);

  let width = clamp(v.width || cW, 0, cW);
  let height = v.height || cH;

  if (v.widthSuffix === "%") {
    width = (v.width * cW) / 100;
  }

  if (v.heightSuffix === "%") {
    const newcH = width / (imageWidth / imageHeight);
    height = (v.height * newcH) / 100;
  }

  return { width: roundTo(width, 2), height: roundTo(height, 2) };
};

export const calcWrapperPredefinedSizes = (
  size: PredefinedCustomSize,
  cW: number
): WrapperSizes => {
  if (size.width > cW) {
    const r = cW / size.width;

    return {
      width: clamp(size.width, 0, cW),
      height: roundTo(size.height * r, 2)
    };
  }

  return {
    width: size.width,
    height: size.height
  };
};

export const calcWrapperOriginalSizes = (
  v: ImageValue,
  cW: number
): WrapperSizes => {
  const imageWidth = v.imageWidth || DEFAULT_IMAGE_SIZES.width;
  const imageHeight = v.imageHeight || DEFAULT_IMAGE_SIZES.height;
  const width = (v.size * cW) / 100;
  const newcH = width / (imageWidth / imageHeight);
  const height = (v.size * newcH) / 100;

  return {
    width: roundTo(width, 2),
    height: roundTo(height, 2)
  };
};

export const calcImageSizes = (
  v: Value,
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

export const isSVG = (extension: string): extension is "svg" =>
  extension === "svg";
export const isGIF = (extension: string): extension is "gif" =>
  extension === "gif";

export const isPredefinedSize = (
  size: ALLSizes
): size is PredefinedCustomSize => {
  return typeof size === "object" && "width" in size && "height" in size;
};

export const isOriginalSize = (
  size: ALLSizes
): size is PredefinedOriginalSize => {
  return size === "original";
};

export const isCustomSize = (size: ALLSizes): size is CustomSize => {
  return size === "custom";
};

export const getImageSize = (size: string): ALLSizes => {
  if (size === "custom") {
    return "custom";
  }

  const config = Config.getAll();
  const { imageSizes } = config;
  const imageData = imageSizes?.find(({ name }) => name === size);

  if (
    imageData !== undefined &&
    !isNullish(imageData.height) &&
    !isNullish(imageData.width)
  ) {
    const { width, height } = imageData;

    return {
      width,
      height,
      widthSuffix: "px",
      heightSuffix: "px"
    };
  }

  return "original";
};

export const getSizeType = (v: V, device: ResponsiveMode): string => {
  if (v.imagePopulation) {
    const placeholderData = placeholderObjFromStr(v.imagePopulation);

    if (placeholderData?.attr?.size !== undefined) {
      const size = Str.read(placeholderData.attr.size) ?? "custom";
      return size.trim().length > 0 ? size : "custom";
    }

    return "custom";
  }

  return defaultValueValue({ v, device, key: "sizeType" });
};

export const showOriginalImage = (v: V): boolean =>
  Boolean(
    !isSVG(v.imageExtension) &&
      !isGIF(v.imageExtension) &&
      v.imageSrc &&
      v.showOriginalImage === "on"
  );
