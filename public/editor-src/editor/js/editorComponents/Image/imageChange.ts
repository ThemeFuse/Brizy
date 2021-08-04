import { ImagePatch } from "./types/ImagePatch";
import { calcWrapperSizes } from "./utils";
import { isUnit, Unit } from "./types";
import { optional, readWithParser } from "visual/utils/reader/readWithParser";
import { ElementModel } from "visual/component/Elements/Types";
import { mPipe, pass } from "visual/utils/fp";
import * as Num from "visual/utils/math/number";
import { prop } from "visual/utils/object/get";

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
  widthSuffix: Unit;
  heightSuffix: Unit;
  showOriginalImage?: "on" | "off";
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
  )
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
      height: v.height
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
    width: Math.round(newCW),
    height: Math.round(newCH)
  };
};
