import Config from "visual/global/Config";
import { assetUrl } from "visual/utils/asset";
import { applyFilter } from "visual/utils/filters";

export function blockThumbnailUrl(block) {
  const configUrl = Config.get("urls").blockThumbnails;
  const url = configUrl
    ? `${configUrl}/${block.id}.jpg`
    : assetUrl(`template/img-block-thumbs/${block.id}.jpg`);

  return applyFilter("blockThumbnailUrl", url, block);
}

export function placeholderBlockThumbnailUrl() {
  return assetUrl("editor/img/block-placeholder.jpg");
}
