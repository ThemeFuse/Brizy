import Config from "visual/global/Config";
import { isPlaceholderStr } from "visual/editorComponents/EditorComponent/DynamicContent/utils";
import { downloadImageFromCloud } from "visual/utils/api";
import { objectToQueryString, isAbsoluteUrl } from "visual/utils/url";
import cloudImageUrl, { getFilter, svgUrl as cloudSvgUrl } from "./imageUrl.ts";
import { imageAttachments } from "./imageAttachments";

const siteUrl = Config.get("urls").site;
const imageUrlPrefix = siteUrl.includes("?") ? `${siteUrl}&` : `${siteUrl}/?`;
const pendingRequests = {};

export default function imageUrl(
  src,
  options = {
    iW: 5000,
    iH: "any"
  }
) {
  if (isAbsoluteUrl(src) || isPlaceholderStr(src)) {
    return src;
  }

  if (!src) {
    return null;
  }

  if (IS_EDITOR) {
    const filter = getFilter(options);
    const imageDownloaded =
      imageAttachments.has(src) || src.indexOf("wp-") === 0;

    if (imageDownloaded) {
      const prefix = Config.get("prefix") ?? "brizy";
      const queryString = objectToQueryString({
        [`${prefix}_media`]: src,
        [`${prefix}_crop`]: filter,
        [`${prefix}_post`]: Config.get("wp").page
      });

      return imageUrlPrefix + queryString;
    } else {
      if (!pendingRequests[src]) {
        pendingRequests[src] = true;

        downloadImageFromCloud(src).then(() => {
          pendingRequests[src] = false;
          imageAttachments.add(src);
        });
      }

      return cloudImageUrl(src, options);
    }
  } else {
    const filter = getFilter(options);
    const prefix = Config.get("prefix") ?? "brizy";
    const queryString = objectToQueryString({
      [`${prefix}_media`]: src,
      [`${prefix}_crop`]: filter,
      [`${prefix}_post`]: Config.get("wp").page
    });

    return imageUrlPrefix + queryString;
  }
}

export function svgUrl(src) {
  if (!src) {
    return null;
  }

  if (IS_EDITOR) {
    const imageDownloaded =
      imageAttachments.has(src) || src.indexOf("wp-") === 0;

    if (!imageDownloaded && !pendingRequests[src]) {
      pendingRequests[src] = true;

      downloadImageFromCloud(src).then(() => {
        pendingRequests[src] = false;
        imageAttachments.add(src);
      });

      return cloudSvgUrl(src);
    }
  }

  const { customFile } = Config.get("urls");

  return `${customFile}${src}`;
}
