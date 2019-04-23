import Config from "visual/global/Config";
import { urlContainsQueryString, objectToQueryString } from "visual/utils/url";

export function blockScreenshotUrl(block, meta) {
  const { _thumbnailSrc, _thumbnailTime } = block.value;
  const siteUrl = Config.get("urls").site;
  const page = Config.get("wp").page;
  const qs = objectToQueryString({
    brizy_post: page,
    brizy_block_screenshot: _thumbnailSrc,
    brizy_block_type:
      meta.isSavedBlock || meta.isGlobalBlock ? "global" : "normal",
    t: _thumbnailTime || Date.now()
  });

  return urlContainsQueryString(siteUrl)
    ? `${siteUrl}&${qs}`
    : `${siteUrl}?${qs}`;
}
