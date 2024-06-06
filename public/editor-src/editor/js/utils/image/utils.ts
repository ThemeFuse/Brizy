import _ from "underscore";
import { SizeType } from "visual/global/Config/types/configs/common";
import { makeUrl } from "visual/utils/api";
import { read as readStr } from "visual/utils/reader/string";
import { objectToQueryString } from "visual/utils/url";
import { CustomSize, Data, FilterOption, ImageType } from "./types";

export const getFilter = (options: FilterOption): string => {
  const roundedOptions = _.mapObject(options, (val) =>
    typeof val === "number" ? Math.round(val) : val
  );

  return objectToQueryString(roundedOptions);
};

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
