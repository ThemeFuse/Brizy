import { Value as ImageUploadValue } from "visual/component/Options/types/dev/ImageUpload/Types";
import { placeholderObjFromStr } from "visual/editorComponents/EditorComponent/DynamicContent/utils";
import Config from "visual/global/Config";
import { SizeType } from "visual/global/Config/types/configs/common";
import { getImageUrl } from "visual/utils/image";
import { clamp, roundTo } from "visual/utils/math";
import { defaultValueValue } from "visual/utils/onChange";
import { ResponsiveMode } from "visual/utils/responsiveMode";
import * as Str from "visual/utils/string/specs";
import { MValue, isNullish } from "visual/utils/value";
import { ImageSize, Unit, V } from "./types";

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

type PredefinedOriginalSize = SizeType.original;

type CustomSize = SizeType.custom;

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
    return SizeType.custom;
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

  return SizeType.original;
};

export const getSizeType = (v: V, device: ResponsiveMode): string => {
  if (v.imagePopulation) {
    const config = Config.getAll();
    const useCustomPlaceholder =
      config.dynamicContent?.useCustomPlaceholder ?? false;
    const placeholderData = placeholderObjFromStr(
      v.imagePopulation,
      useCustomPlaceholder
    );

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

export function getCustomImageUrl(
  v: Partial<ImageUploadValue>,
  wrapperSize: WrapperSizes,
  imageSize: ImageSize
): { url: string; source: string | null } {
  const cW = Math.round(wrapperSize.width);
  const cH = Math.round(wrapperSize.height);

  const src = v.src ?? "";
  const sizeType = v.sizeType ?? "";
  const fileName = v.fileName ?? "";
  const size = getImageSize(sizeType);

  if (isPredefinedSize(size) || isOriginalSize(size)) {
    const url = getImageUrl({
      uid: src,
      fileName: fileName,
      sizeType: sizeType as SizeType
    });

    return {
      source: `${url}`,
      url: `${url} 1x, ${url} 2x`
    };
  }

  const { width: iW, height: iH } = imageSize;

  const oX = Math.abs(imageSize.marginLeft);
  const oY = Math.abs(imageSize.marginTop);

  const options = {
    iW: Math.round(iW),
    iH: Math.round(iH),
    oX: Math.round(oX),
    oY: Math.round(oY),
    cW: Math.round(cW),
    cH: Math.round(cH)
  };
  const url = getImageUrl({
    uid: src,
    crop: options,
    fileName,
    sizeType: SizeType.custom
  });
  const retinaUrl = getImageUrl({
    uid: src,
    crop: multiplier(options, 2),
    fileName,
    sizeType: SizeType.custom
  });

  return {
    source: `${url}`,
    url: `${url} 1x, ${retinaUrl} 2x`
  };
}

export function multiplier<
  T extends Record<string, string | number | undefined>
>(data: T, num: number): T {
  const maxRetinaSize = 9000; // restrictions for backend
  return Object.entries(data).reduce((acc: T, [key, value]) => {
    acc[key as keyof T] = (
      typeof value === "number" ? Math.min(value * num, maxRetinaSize) : value
    ) as T[keyof T];
    return acc;
  }, data);
}

export const readUnit = (v: unknown): MValue<Unit> => {
  if (v === "px" || v === "%") {
    return v;
  }
};

export const readSizeType = (sizeType: unknown): MValue<SizeType> => {
  switch (sizeType) {
    case SizeType.custom:
    case SizeType.original:
      return sizeType;
  }
};
