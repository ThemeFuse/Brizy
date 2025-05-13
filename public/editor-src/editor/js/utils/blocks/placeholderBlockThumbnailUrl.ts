import { ConfigCommon } from "visual/global/Config/types/configs/ConfigCommon";
import { assetUrl } from "visual/utils/asset";

export function placeholderBlockThumbnailUrl(config: ConfigCommon): string {
  return assetUrl("editor/img/block-placeholder.jpg", config);
}
