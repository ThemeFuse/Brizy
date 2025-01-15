import { mPipe, optional, pass } from "fp-utilities";
import { ElementModel } from "visual/component/Elements/Types";
import { EditorComponentContextValue } from "visual/editorComponents/EditorComponent/EditorComponentContext";
import { DeviceMode } from "visual/types";
import * as Math from "visual/utils/math";
import * as Num from "visual/utils/math/number";
import { prop } from "visual/utils/object/get";
import { defaultValueKey, defaultValueValue } from "visual/utils/onChange";
import { readWithParser } from "visual/utils/reader/readWithParser";
import { is as isNoEmptyString } from "visual/utils/string/NoEmptyString";
import * as Str from "visual/utils/string/specs";
import { isUnit, Unit } from "./types";
import {
  ImageDCPatch,
  ImagePatch,
  SizeTypePatch,
  UnitPatch
} from "./types/ImagePatch";
import {
  calcWrapperSizes,
  getImageDCSize,
  getImageSize,
  isCustomSize,
  isOriginalSize,
  isPredefinedSize
} from "./utils";
import { SizeType } from "visual/global/Config/types/configs/common";
import { ImageDataSize } from "visual/global/Config/types/ImageSize";

export interface Size {
  width: number;
  height: number;
}

export interface Patch {
  imageWidth: number;
  imageHeight: number;
  imageSrc: string;
  imageExtension: string;
  alt: string | null;
  width: number;
  height: number;
  widthSuffix: Unit;
  heightSuffix: Unit;
  tabletWidth: number | null;
  tabletHeight: number | null;
  tabletWidthSuffix: Unit | null;
  tabletHeightSuffix: Unit | null;
  mobileWidth: number | null;
  mobileHeight: number | null;
  mobileWidthSuffix: Unit | null;
  mobileHeightSuffix: Unit | null;
}

export interface Value extends Size {
  imageExtension: string;
  size: number;
  widthSuffix: Unit;
  heightSuffix: Unit;
  sizeType: string;
  imagePopulation?: string;
  tabletWidth?: number;
  tabletHeight?: number;
  tabletWidthSuffix?: Unit;
  tabletHeightSuffix?: Unit;
  mobileWidth?: number;
  mobileHeight?: number;
  mobileWidthSuffix?: Unit;
  mobileHeightSuffix?: Unit;
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
  sizeType: string;
}

export interface PatchUnit {
  width?: number;
  height?: number;
  widthSuffix?: Unit;
  heightSuffix?: Unit;
  tabletWidth?: number;
  tabletHeight?: number;
  tabletWidthSuffix?: Unit;
  tabletHeightSuffix?: Unit;
  mobileWidth?: number;
  mobileHeight?: number;
  mobileWidthSuffix?: Unit;
  mobileHeightSuffix?: Unit;
}

export interface ElementModelToValue extends ElementModel {
  width: unknown | undefined;
  height: unknown | undefined;
  heightSuffix: unknown | undefined;
  widthSuffix: unknown | undefined;
  sizeType: unknown | undefined;
  size: unknown | undefined;
  imageExtension: unknown | undefined;
  imagePopulation: unknown | undefined;
  tabletWidth: unknown | undefined;
  tabletHeight: unknown | undefined;
  tabletWidthSuffix: unknown | undefined;
  tabletHeightSuffix: unknown | undefined;
  mobileWidth: unknown | undefined;
  mobileHeight: unknown | undefined;
  mobileWidthSuffix: unknown | undefined;
  mobileHeightSuffix: unknown | undefined;
}

export const elementModelToValue = readWithParser<ElementModelToValue, Value>({
  height: mPipe(prop("height"), Num.read),
  width: mPipe(prop("width"), Num.read),
  heightSuffix: mPipe(prop("heightSuffix"), pass(isUnit)),
  widthSuffix: mPipe(prop("widthSuffix"), pass(isUnit)),
  sizeType: mPipe(prop("sizeType"), Str.read),
  size: mPipe(prop("size"), Num.read),
  imageExtension: mPipe(prop("imageExtension"), Str.read),
  imagePopulation: optional(mPipe(prop("imagePopulation"), Str.read)),
  tabletWidth: optional(mPipe(prop("tabletWidth"), Num.read)),
  tabletHeight: optional(mPipe(prop("tabletHeight"), Num.read)),
  tabletWidthSuffix: optional(mPipe(prop("tabletWidthSuffix"), pass(isUnit))),
  tabletHeightSuffix: optional(mPipe(prop("tabletHeightSuffix"), pass(isUnit))),
  mobileWidth: optional(mPipe(prop("mobileWidth"), Num.read)),
  mobileHeight: optional(mPipe(prop("mobileHeight"), Num.read)),
  mobileWidthSuffix: optional(mPipe(prop("mobileWidthSuffix"), pass(isUnit))),
  mobileHeightSuffix: optional(mPipe(prop("mobileHeightSuffix"), pass(isUnit)))
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
  const alt = patch.alt ?? null;
  const src = patch.imageSrc;
  const isSvgOrGif = extension === "svg" || extension === "gif";

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
  let newWidthSuffix = v.widthSuffix;
  let newHeightSuffix = v.heightSuffix;
  let newTabletWidth = v.tabletWidth ?? null;
  let newTabletHeight = v.tabletHeight ?? null;
  let newTabletWidthSuffix = v.tabletWidthSuffix ?? null;
  let newTabletHeightSuffix = v.tabletHeightSuffix ?? null;
  let newMobileWidth = v.mobileWidth ?? null;
  let newMobileHeight = v.mobileHeight ?? null;
  let newMobileWidthSuffix = v.mobileWidthSuffix ?? null;
  let newMobileHeightSuffix = v.mobileHeightSuffix ?? null;

  if (v.widthSuffix === "%") {
    const w = v.width || 100;
    newCW = (wrapperSizes.width * w) / newWrapperSizes.width;
  } else {
    if (isSvgOrGif) {
      const resize = Math.roundTo((v.width / cW) * 100, 2);
      newCW = Math.clamp(resize, 0, 100);
      newWidthSuffix = "%";
    }
  }

  // we need to reset responsive values & height,
  // because old values is not relevant to new aspect ratio of svg / gif
  if (isSvgOrGif) {
    newCH = 100;
    newHeightSuffix = "%";
    newTabletWidth = null;
    newTabletHeight = null;
    newTabletWidthSuffix = null;
    newTabletHeightSuffix = null;
    newMobileWidth = null;
    newMobileHeight = null;
    newMobileWidthSuffix = null;
    newMobileHeightSuffix = null;
  } else {
    if (v.heightSuffix === "%") {
      const h = v.height || 100;
      newCH = (wrapperSizes.height * h) / newWrapperSizes.height;
    }
  }

  return {
    imageWidth: imgWidth,
    imageHeight: imgHeight,
    imageSrc: src,
    imageExtension: extension,
    alt,
    width: Math.roundTo(newCW, 2),
    height: Math.roundTo(newCH, 2),
    widthSuffix: newWidthSuffix,
    heightSuffix: newHeightSuffix,
    mobileHeight: newMobileHeight,
    mobileHeightSuffix: newMobileHeightSuffix,
    mobileWidth: newMobileWidth,
    mobileWidthSuffix: newMobileWidthSuffix,
    tabletHeight: newTabletHeight,
    tabletHeightSuffix: newTabletHeightSuffix,
    tabletWidth: newTabletWidth,
    tabletWidthSuffix: newTabletWidthSuffix
  };
};

export const patchOnSizeTypeChange = (
  cW: number,
  patch: SizeTypePatch,
  imageSizes: ImageDataSize[]
): PatchSize => {
  const type = patch.sizeType;
  const patchSize: PatchSize = {
    sizeType: type
  };
  const size = getImageSize(type, imageSizes);

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
  wrapperSizes: Size,
  context: EditorComponentContextValue,
  imageSizes: ImageDataSize[]
): PatchDC => {
  if (!patch.imagePopulation) {
    return {
      width: 100,
      height: 100,
      widthSuffix: "%",
      heightSuffix: "%",
      sizeType: SizeType.custom
    };
  }

  const dcSize = getImageDCSize(patch.imagePopulation, context);

  if (dcSize === undefined) {
    return {
      sizeType: SizeType.custom,
      height: wrapperSizes.height,
      heightSuffix: "px"
    };
  }

  const size = getImageSize(dcSize, imageSizes);

  if (isPredefinedSize(size)) {
    const resize = Math.roundTo((size.width / cW) * 100, 2);

    return {
      sizeType: dcSize,
      size: Math.clamp(resize, 0, 100)
    };
  }

  return {
    sizeType: isNoEmptyString(dcSize) ? dcSize : SizeType.custom,
    size: 100
  };
};

const normalizeWidth = (cW: number, width: number, suffix: Unit): number => {
  switch (suffix) {
    case "%": {
      return Math.roundTo((width / cW) * 100, 2);
    }
    case "px": {
      return Math.roundTo((width / 100) * cW, 2);
    }
  }
};

export const pathOnUnitChange = (
  cW: number,
  v: Value,
  patch: UnitPatch,
  device: DeviceMode
): PatchUnit => {
  const extension = v.imageExtension;
  const population = v.imagePopulation;
  const isSvgOrGif = extension === "svg" || extension === "gif";
  const dvk = (key: string): string =>
    defaultValueKey({ key, device, state: "normal" });
  const [suffixKey] = Object.keys(patch).filter(
    (key) => key === dvk("widthSuffix") || key === dvk("heightSuffix")
  );
  const dvv = (key: string): unknown => defaultValueValue({ key, v, device });

  if (suffixKey === undefined) {
    return patch;
  }

  const widthKey = dvk("width");
  const width = Num.read(dvv("width"));
  const vPatched = dvv(suffixKey);
  const patchValue = patch[suffixKey];

  if (!isUnit(patchValue) || width === undefined) {
    return {};
  }

  if (!isSvgOrGif || population || vPatched === patchValue) {
    return patch;
  }

  return {
    [suffixKey]: patchValue,
    [widthKey]: normalizeWidth(cW, width, patchValue)
  };
};
