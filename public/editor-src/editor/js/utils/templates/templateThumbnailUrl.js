import Config from "visual/global/Config";
import { assetUrl } from "visual/utils/asset";
import { applyFilter } from "visual/utils/filters";

export function templateThumbnailUrl(template) {
  const configUrl = Config.get("urls").templateThumbnails;
  const url = configUrl
    ? `${configUrl}/${template.id}.jpg`
    : assetUrl(`template/img-template-thumbs/${template.id}.jpg`);

  return applyFilter("templateThumbnailUrl", url, template);
}
