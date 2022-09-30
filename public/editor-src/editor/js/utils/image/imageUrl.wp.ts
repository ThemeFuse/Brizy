import { isPlaceholderStr } from "visual/editorComponents/EditorComponent/DynamicContent/utils";
import Config, { WP } from "visual/global/Config";
import * as Str from "visual/utils/string/specs";
import {
  isAbsoluteUrl,
  objectToQueryString,
  urlContainsQueryString
} from "visual/utils/url";
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
    const extension = getImageFormat(src);

    if (extension) {
      const config = Config.getAll() as WP;
      const prefix = config.prefix ?? "brizy";
      const siteUrl = config.urls.site;
      const imageUrlPrefix = urlContainsQueryString(siteUrl)
        ? `${siteUrl}&`
        : `${siteUrl}/?`;
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { fileName, ..._filterOptions } = options;
      const filter = getFilter({ ...defaultOptions, ..._filterOptions });
      const queryString = objectToQueryString({
        [`${prefix}_media`]: src,
        [`${prefix}_crop`]: filter
      });

      return `${imageUrlPrefix}${queryString}`;
    }
  }

  return null;
};

export default imageUrl;

export const svgUrl: SvgUrl = (_src) => {
  const src = Str.read(_src);

  if (src) {
    const extension = getImageFormat(src);

    if (extension) {
      const config = Config.getAll();
      return [config.urls.customFile, src].join("/");
    }

    return null;
  }

  return null;
};

export const imageSpecificSize: ImageSpecificSize = (src, options) => {
  const config = Config.getAll() as WP;
  const siteUrl = config.urls.site;
  const { size } = options;
  const extension = getImageFormat(src);

  if (extension) {
    const imageUrlPrefix = urlContainsQueryString(siteUrl)
      ? `${siteUrl}&`
      : `${siteUrl}/?`;
    const prefix = config.prefix ?? "brizy";
    const queryString = objectToQueryString({
      [`${prefix}_media`]: src,
      [`${prefix}_crop`]: size
    });

    return `${imageUrlPrefix}${queryString}`;
  }

  return null;
};
