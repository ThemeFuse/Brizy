import Config from "visual/global/Config";
import { objectToQueryString } from "visual/utils/url";

export function blockScreenshotUrl(block) {
  const { _thumbnailSrc, _thumbnailTime } = block.value;
  const screenshotUrl = Config.get("urls").screenshot;
  const qs = objectToQueryString({
    t: _thumbnailTime || Date.now()
  });

  return `${screenshotUrl}/${_thumbnailSrc}?${qs}`;
}
