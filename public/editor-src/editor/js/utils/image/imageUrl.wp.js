import Config from "visual/global/Config";
import * as Api from "visual/utils/api/editor";
import { objectToQueryString } from "visual/utils/url";
import nonWPImageUrl, { getFilter } from "./imageUrl.js";

const { pageAttachments } = Config.get("wp");
const siteUrl = Config.get("urls").site;

const pendingRequests = {};
const imageUrlPrefix = siteUrl.includes("?") ? `${siteUrl}&` : `${siteUrl}/?`;

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
      pageAttachments.images[imageSrc] || imageSrc.indexOf("wp-") === 0;

    if (imageDownloaded) {
      const queryString = objectToQueryString({
        brizy_media: imageSrc,
        brizy_crop: filter,
        brizy_post: Config.get("wp").page
      });

      return imageUrlPrefix + queryString;
    } else {
      if (!pendingRequests[imageSrc]) {
        pendingRequests[imageSrc] = true;

        Api.downloadImageFromCloud(imageSrc).then(() => {
          pendingRequests[imageSrc] = false;
          pageAttachments.images[imageSrc] = true;
        });
      }

      return nonWPImageUrl(imageSrc, options);
    }
  } else {
    const filter = getFilter(options);
    const queryString = objectToQueryString({
      brizy_media: imageSrc,
      brizy_crop: filter,
      brizy_post: Config.get("wp").page
    });

    return imageUrlPrefix + queryString;
  }
}
