import { ImageDCPatch, ImagePatch, SizeTypePatch } from "./types/ImagePatch";
import {
  calcWrapperSizes,
  getImageSize,
  isCustomSize,
  isOriginalSize,
  isPredefinedSize
} from "./utils";
import { isUnit, Unit } from "./types";
import { optional, readWithParser } from "visual/utils/reader/readWithParser";
import { ElementModel } from "visual/component/Elements/Types";
import { mPipe, pass } from "visual/utils/fp";
import * as Num from "visual/utils/math/number";
import * as Math from "visual/utils/math";
import * as Str from "visual/utils/string/specs";
import { prop } from "visual/utils/object/get";
import { placeholderObjFromStr } from "visual/editorComponents/EditorComponent/DynamicContent/utils";

export interface Size {
  width: number;
  height: number;
}

export interface Patch {
  imageWidth: number;
  imageHeight: number;
  imageSrc: string;
  imageExtension: string;
  width: number;
  height: number;
}

export interface Value extends Size {
  size: number;
  widthSuffix: Unit;
  heightSuffix: Unit;
  sizeType: string;
  showOriginalImage?: "on" | "off";
  imagePopulation?: string;
}

export interface PatchSize {
  sizeType: string;
  size?: number;
  width?: number;
  height?: number;
  widthSuffix?: Unit;
  heightSuffix?: Unit;
}

export interface PatchDC {
  size?: number;
  width?: number;
  height?: number;
  heightSuffix?: Unit;
  widthSuffix?: Unit;
}

export const elementModelToValue = readWithParser<ElementModel, Value>({
  height: mPipe(prop("height"), Num.read),
  width: mPipe(prop("width"), Num.read),
  heightSuffix: mPipe(prop("heightSuffix"), pass(isUnit)),
  widthSuffix: mPipe(prop("widthSuffix"), pass(isUnit)),
  showOriginalImage: optional(
    mPipe(
      prop("showOriginalImage"),
      pass((v): v is "on" | "off" => ["on", "off"].includes(v as string))
    )
  ),
  sizeType: mPipe(prop("sizeType"), Str.read),
  size: mPipe(prop("size"), Num.read)
});

export const patchOnImageChange = (
  cW: number,
  v: Value,
  wrapperSizes: Size,
  patch: ImagePatch
): Patch => {
  const imgWidth = patch.imageWidth;
  const imgHeight = patch.imageHeight;
  const extension = patch.imageExtension;
  const src = patch.imageSrc;

  const newWrapperSizes = calcWrapperSizes(
    {
      imageWidth: imgWidth,
      imageHeight: imgHeight,
      widthSuffix: v.widthSuffix,
      heightSuffix: v.heightSuffix,
      width: v.width,
      height: v.height,
      size: v.size
    },
    cW
  );

  let newCW = wrapperSizes.width;
  let newCH = wrapperSizes.height;

  if (v.widthSuffix === "%") {
    const w = v.width || 100;
    newCW = (wrapperSizes.width * w) / newWrapperSizes.width;
  }

  if (v.heightSuffix === "%") {
    const h = v.height || 100;
    newCH = (wrapperSizes.height * h) / newWrapperSizes.height;
  }

  // Conditions for SVG & GIF
  const isSvgOrGif = extension === "svg" || extension === "gif";
  if (isSvgOrGif || (!isSvgOrGif && src && v.showOriginalImage === "on")) {
    const originalCH = wrapperSizes.width / (imgWidth / imgHeight);
    newCH = v.heightSuffix === "px" ? originalCH : 100;
  }

  return {
    imageWidth: imgWidth,
    imageHeight: imgHeight,
    imageSrc: src,
    imageExtension: extension,
    width: Math.roundTo(newCW, 2),
    height: Math.roundTo(newCH, 2)
  };
};

export const patchOnSizeTypeChange = (
  cW: number,
  v: Value,
  patch: SizeTypePatch
): PatchSize => {
  const type = patch.sizeType;
  const patchSize: PatchSize = {
    sizeType: type
  };
  const size = getImageSize(type);

  if (isPredefinedSize(size)) {
    const resize = Math.roundTo((size.width / cW) * 100, 2);
    patchSize.size = Math.clamp(resize, 0, 100);
  }

  if (isOriginalSize(size)) {
    patchSize.size = 100;
  }

  // Need to reset all value to percentage
  if (isCustomSize(size)) {
    patchSize.width = 100;
    patchSize.height = 100;
    patchSize.widthSuffix = "%";
    patchSize.heightSuffix = "%";
  }

  return patchSize;
};

export const patchOnDCChange = (
  cW: number,
  patch: ImageDCPatch,
  wrapperSizes: Size
): PatchDC => {
  const placeholderData = placeholderObjFromStr(patch.imagePopulation);

  if (placeholderData === undefined) {
    return {
      width: 100,
      height: 100,
      widthSuffix: "%",
      heightSuffix: "%"
    };
  }

  const { attr } = placeholderData;
  const getSize = mPipe(Str.read, getImageSize);
  const size = getSize(attr?.size);

  if (size !== undefined) {
    if (isPredefinedSize(size)) {
      const resize = Math.roundTo((size.width / cW) * 100, 2);

      return {
        size: Math.clamp(resize, 0, 100)
      };
    }

    return {
      size: 100
    };
  }

  return {
    height: wrapperSizes.height,
    heightSuffix: "px"
  };
};
