import normalizeUrl from "normalize-url";
import {
  defaultCrop,
  SizeType
} from "visual/global/Config/types/configs/common";
import { makeUrl } from "visual/utils/api";
import { parseCropData } from "visual/utils/image/parsers";
import { read as readStr } from "visual/utils/reader/string";
import * as Str from "../reader/string";
import {
  CustomSize,
  Data,
  DataUrl,
  ImageType,
  PlaceholdersValues,
  ResizeData
} from "./types";

export const isCropSize = (d: Data): d is CustomSize =>
  d.sizeType === SizeType.custom;

export const isSVGExtension = (extension: string): extension is "svg" =>
  extension === "svg";

export const isGIFExtension = (extension: string): extension is "gif" =>
  extension === "gif";

export const isUnsplashImage = (type: ImageType): type is ImageType.Unsplash =>
  type === ImageType.Unsplash;

export const getUnsplashCrop = (data: Data): string => {
  const { cW = "", cH = "" } = isCropSize(data) && data.crop ? data.crop : {};

  const _cW = readStr(cW);
  const _cH = readStr(cH);

  return makeUrl(data.uid, {
    q: "80",
    fit: "crop",
    ...(_cW ? { w: _cW } : {}),
    ...(_cH ? { h: _cH } : {})
  });
};

export const UNSPLASH_BG_IMAGE_WIDTH = 1920;

export const knownPlaceholders = [
  "[iW]",
  "[iH]",
  "[cW]",
  "[cH]",
  "[baseUrl]",
  "[uid]",
  "[fileName]",
  "[oX]",
  "[oY]"
];

export const getPlaceholders = (pattern: string): string[] => {
  const placeholderRegex = /\[([^\]]+)\]/g;

  return pattern.match(placeholderRegex) || [];
};

export const replaceSymbols = (input: string): string => {
  return input.replaceAll("{", "").replaceAll("}", "").replaceAll(" ", "");
};

export const replacePlaceholders = (options: ResizeData): string => {
  const { pattern, baseUrl, fileName, uid, sizeType, crop } = options;

  const placeholders = getPlaceholders(pattern);

  const values: PlaceholdersValues = {
    baseUrl,
    fileName,
    uid,
    sizeType,
    ...crop
  };

  const finalUrl = placeholders.reduce((url, placeholder) => {
    const key = placeholder.replace("[", "").replace("]", "");
    const value = Str.read(values[key]);

    return value
      ? url.replace(placeholder, value)
      : knownPlaceholders.includes(placeholder)
      ? url.replace(placeholder, "")
      : url;
  }, pattern);

  return normalizeUrl(replaceSymbols(finalUrl), {
    sortQueryParameters: false,
    stripWWW: false
  });
};

export const generateUrl = (options: DataUrl): string => {
  const { crop, baseUrl, uid, fileName, patterns, sizeType } = options;

  const parsedCropData = parseCropData(crop);

  const baseOptions = { baseUrl, uid, fileName };

  // Case when size is custom but crop is undefined
  if (sizeType && sizeType === SizeType.custom && !parsedCropData) {
    return replacePlaceholders({
      pattern: patterns.split,
      ...baseOptions,
      crop: defaultCrop
    });
  }

  // Case when size is predefined (original, thumbnail, 200x200 etc.)
  if (parsedCropData === undefined) {
    return replacePlaceholders({
      pattern: patterns.original,
      sizeType: SizeType.original,
      ...baseOptions
    });
  }

  // Case when "iH" is "any"
  if (parsedCropData.iH === "any") {
    return replacePlaceholders({
      pattern: patterns.split,
      crop: parsedCropData,
      ...baseOptions
    });
  }

  // Case when size = custom and crop exists
  return replacePlaceholders({
    pattern: patterns.full,
    crop: parsedCropData,
    ...baseOptions
  });
};
