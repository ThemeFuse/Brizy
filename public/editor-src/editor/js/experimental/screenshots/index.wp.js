import Config from "visual/global/Config";
import { addFilter } from "visual/utils/filters";
import { urlContainsQueryString, objectToQueryString } from "visual/utils/url";
import { browserScreenshotsSupported } from "./utils/browserScreenshotsSupported";
import screenshotsMiddleware from "./redux/middleware/screenshots";

let screenshotsSupported = false;

addFilter("bootstraps.editor.middleware", async middleware => {
  try {
    screenshotsSupported = await browserScreenshotsSupported();
  } catch (e) {
    screenshotsSupported = false;
  }

  // it is important to put the screenshot middleware before
  // the api one (which comes last) so this is why we slice
  // this is not ideal because it means that screenshots knows
  // about other core middleware and their order
  // but this will have to do for now
  return screenshotsSupported
    ? [
        ...middleware.slice(0, -1),
        screenshotsMiddleware,
        ...middleware.slice(-1)
      ]
    : middleware;
});

// "blockThumbnailUrl__real" is temporary
// and will be replaced with "blockThumbnailUrl"
// within the next few releases
addFilter(
  "blockThumbnailUrl__real",
  (url, block) => {
    const { _thumbnailSrc, _thumbnailWidth, _thumbnailHeight } = block.value;

    if (
      screenshotsSupported &&
      _thumbnailSrc &&
      _thumbnailWidth &&
      _thumbnailHeight
    ) {
      return blockThumbnailUrlHelper(block);
    } else {
      return url;
    }
  },
  1000
);

addFilter(
  "blockThumbnailData",
  (data, block) => {
    const { _thumbnailSrc, _thumbnailWidth, _thumbnailHeight } = block.value;

    if (
      screenshotsSupported &&
      _thumbnailSrc &&
      _thumbnailWidth &&
      _thumbnailHeight
    ) {
      return {
        url: blockThumbnailUrlHelper(block),
        width: _thumbnailWidth,
        height: _thumbnailHeight
      };
    } else {
      return data;
    }
  },
  1000
);

function blockThumbnailUrlHelper(block) {
  const { _thumbnailSrc, _thumbnailTime } = block.value;

  const page = Config.get("wp").page;
  const siteUrl = Config.get("urls").site;
  const qs = objectToQueryString({
    brizy_post: page,
    brizy_block_screenshot: _thumbnailSrc,
    brizy_block_type: block.type === "GlobalBlock" ? "global" : "normal",
    t: _thumbnailTime || Date.now()
  });

  return urlContainsQueryString(siteUrl)
    ? `${siteUrl}&${qs}`
    : `${siteUrl}?${qs}`;
}
