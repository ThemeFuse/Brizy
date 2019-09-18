import Config from "visual/global/Config";
import { assetUrl } from "visual/utils/asset";

export function templateThumbnailUrl(template) {
  const configUrl = Config.get("urls").templateThumbnails;
  const url = configUrl
    ? `${configUrl}/${template.id}.jpg`
    : assetUrl(`thumbs/${template.id}.jpg`);

  return url;
}
