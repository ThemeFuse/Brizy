import Config from "visual/global/Config";
import { downloadImageFromCloud } from "visual/utils/api";
import { objectToQueryString } from "visual/utils/url";
import cloudImageUrl, { getFilter, svgUrl as cloudSvgUrl } from "./imageUrl.js";
import { imageAttachments } from "./imageAttachments";

const siteUrl = Config.get("urls").site;
const imageUrlPrefix = siteUrl.includes("?") ? `${siteUrl}&` : `${siteUrl}/?`;
const pendingRequests = {};

export default function imageUrl(
  imageSrc,
  options = {
    iW: 5000,
    iH: "any"
  }
) {
  if (!imageSrc) {
    return null;
  }

  if (IS_EDITOR) {
    const filter = getFilter(options);
    const imageDownloaded =
      imageAttachments.has(imageSrc) || imageSrc.indexOf("wp-") === 0;

    if (imageDownloaded) {
      const prefix = Config.get("prefix") ?? "brizy";
      const queryString = objectToQueryString({
        [`${prefix}_media`]: imageSrc,
        [`${prefix}_crop`]: filter,
        [`${prefix}_post`]: Config.get("wp").page
      });

      return imageUrlPrefix + queryString;
    } else {
      if (!pendingRequests[imageSrc]) {
        pendingRequests[imageSrc] = true;

        downloadImageFromCloud(imageSrc).then(() => {
          pendingRequests[imageSrc] = false;
          imageAttachments.add(imageSrc);
        });
      }

      return cloudImageUrl(imageSrc, options);
    }
  } else {
    const filter = getFilter(options);
    const prefix = Config.get("prefix") ?? "brizy";
    const queryString = objectToQueryString({
      [`${prefix}_media`]: imageSrc,
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
