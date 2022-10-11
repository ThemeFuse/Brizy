import { isPlaceholderStr } from "visual/editorComponents/EditorComponent/DynamicContent/utils";
import Config, { Cloud } from "visual/global/Config";
import * as Str from "visual/utils/string/specs";
import { isAbsoluteUrl } from "visual/utils/url";
import { getImageFormat } from "./imageFormat";
import { FilterOption, ImageSpecificSize, ImageUrl, SvgUrl } from "./types";
import { getFilter } from "./utils";

const defaultOptions: FilterOption = {
  iW: 5000,
  iH: "any"
};

const imageUrl: ImageUrl = (src, options = defaultOptions) => {
  if (isAbsoluteUrl(src) || isPlaceholderStr(src)) {
    return src;
  }

  if (src) {
    const config = Config.getAll();
    const { fileName, ..._filterOptions } = options;

    const filter = getFilter({ ...defaultOptions, ..._filterOptions });

    const extension = getImageFormat(src);

    if (extension) {
      // remove extension
      const uid = src.replace(`.${extension}`, "");

      if (fileName) {
        // remove extension for fileName
        // add extension from UID to fileName
        // the API is doesn't work with original .ext of file
        const fileNameExt = getImageFormat(fileName) ?? "";
        const _fileName = fileName.replace(`.${fileNameExt}`, "");
        const name = `${_fileName}.${extension}`;
        return [config.urls.image, filter, uid, name].join("/");
      }

      const name = `image.${extension}`;
      return [config.urls.image, filter, uid, name].join("/");
    }

    return [config.urls.image, filter, src].join("/");
  }

  return null;
};

export default imageUrl;

export const svgUrl: SvgUrl = (_src, options = {}) => {
  const src = Str.read(_src);

  if (src) {
    const { fileName } = options;
    const config = Config.getAll() as Cloud;
    const extension = getImageFormat(src);

    if (extension) {
      // remove extension
      const uid = src.replace(`.${extension}`, "");

      if (fileName) {
        // remove extension for fileName
        // add extension from UID to fileName
        // the API is doesn't work with original .ext of file
        const fileNameExt = getImageFormat(fileName) ?? "";
        const _fileName = fileName.replace(`.${fileNameExt}`, "");
        const name = `${_fileName}.${extension}`;
        return [config.urls.image, "original", uid, name].join("/");
      }

      const name = `image.${extension}`;
      return [config.urls.image, "original", uid, name].join("/");
    }

    return [config.urls.image, "original", src].join("/");
  }

  return null;
};

export const imageSpecificSize: ImageSpecificSize = (src, options) => {
  const config = Config.getAll() as Cloud;
  const { size, fileName } = options;
  const extension = getImageFormat(src);

  if (extension) {
    // remove extension
    const uid = src.replace(`.${extension}`, "");

    if (fileName) {
      // remove extension for fileName
      // add extension from UID to fileName
      // the API is doesn't work with original .ext of file
      const fileNameExt = getImageFormat(fileName) ?? "";
      const _fileName = fileName.replace(`.${fileNameExt}`, "");
      const name = `${_fileName}.${extension}`;
      return [config.urls.image, size, uid, name].join("/");
    }

    const name = `image.${extension}`;
    return [config.urls.image, size, uid, name].join("/");
  }

  return [config.urls.image, size, src].join("/");
};
