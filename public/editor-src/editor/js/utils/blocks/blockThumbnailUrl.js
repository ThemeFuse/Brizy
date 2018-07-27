import Config from "visual/global/Config";
import { assetUrl } from "visual/utils/asset";

export function blockThumbnailUrl(blockId) {
  const configUrl = Config.get("urls").blockThumbnails;

  return configUrl
    ? `${configUrl}/${blockId}.jpg`
    : assetUrl(`template/img-block-thumbs/${blockId}.jpg`);
}
