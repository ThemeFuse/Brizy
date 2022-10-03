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

  const extension = getImageFormat(src);

  if (src && extension) {
    const config = Config.getAll();
    const { fileName, ..._filterOptions } = options;

    const filter = getFilter({ ...defaultOptions, ..._filterOptions });
    const _fileName = Str.read(fileName) ? fileName : "image";

    // remove extension
    const uid = src.replace(`.${extension}`, "");
    // add extension to fileName
    const name = `${_fileName}.${extension}`;
    return [config.urls.image, filter, uid, name].join("/");
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
    const _fileName = Str.read(fileName) ? fileName : "image";

    if (extension) {
      // remove extension
      const uid = src.replace(`.${extension}`, "");
      // add extension to fileName
      const name = `${_fileName}.${extension}`;
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
  const _fileName = Str.read(fileName) ? fileName : "image";

  if (extension) {
    // remove extension
    const uid = src.replace(`.${extension}`, "");
    // add extension to fileName
    const name = `${_fileName}.${extension}`;
    return [config.urls.image, size, uid, name].join("/");
  }

  return null;
};
