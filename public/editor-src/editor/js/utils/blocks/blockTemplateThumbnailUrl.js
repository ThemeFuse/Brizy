import Config from "visual/global/Config";
import { assetUrl } from "visual/utils/asset";
import { applyFilter } from "visual/utils/filters";
import { placeholderBlockThumbnailUrl } from "./placeholderBlockThumbnailUrl";

export function blockTemplateThumbnailUrl(blockTemplate) {
  if (!blockTemplate) {
    return placeholderBlockThumbnailUrl();
  }

  const configUrl = Config.get("urls").blockThumbnails;
  const url = configUrl
    ? `${configUrl}/${blockTemplate.id}.jpg`
    : assetUrl(`template/img-block-thumbs/${blockTemplate.id}.jpg`);

  // "blockThumbnailUrl" is temporary and kept for backwards compat
  // but will be replaced with "blockTemplateThumbnailUrl" within the next few releases
  return applyFilter("blockThumbnailUrl", url, blockTemplate);
}
