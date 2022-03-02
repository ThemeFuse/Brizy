import Config, { WP } from "visual/global/Config";
import { isPlaceholderStr } from "visual/editorComponents/EditorComponent/DynamicContent/utils";
import {
  objectToQueryString,
  isAbsoluteUrl,
  urlContainsQueryString
} from "visual/utils/url";
import { Options } from "./types";
import { getFilter } from "./utils";

export default function imageUrl(
  src: string,
  options: Options = {
    iW: 5000,
    iH: "any"
  }
): string | null {
  if (isAbsoluteUrl(src) || isPlaceholderStr(src)) {
    return src;
  }

  if (!src) {
    return null;
  }

  const config = Config.getAll() as WP;
  const prefix = config.prefix ?? "brizy";
  const siteUrl = config.urls.site;
  const imageUrlPrefix = urlContainsQueryString(siteUrl)
    ? `${siteUrl}&`
    : `${siteUrl}/?`;

  const filter = getFilter(options);
  const queryString = objectToQueryString({
    [`${prefix}_media`]: src,
    [`${prefix}_crop`]: filter
  });

  return `${imageUrlPrefix}${queryString}`;
}

export function svgUrl(src: string): string | null {
  if (!src) {
    return null;
  }

  const config = Config.getAll();
  const { customFile } = config.urls;

  return `${customFile}${src}`;
}

export function imageSpecificSize(src: string, size: string): string {
  const config = Config.getAll() as WP;
  const siteUrl = config.urls.site;
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
