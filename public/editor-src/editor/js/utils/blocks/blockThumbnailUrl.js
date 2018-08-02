import Config from "visual/global/Config";
import { assetUrl } from "visual/utils/asset";

export function blockThumbnailUrl(block) {
  const configUrl = Config.get("urls").blockThumbnails;

  return configUrl
    ? `${configUrl}/${block.id}.jpg`
    : assetUrl(`template/img-block-thumbs/${block.id}.jpg`);
}
