import Config from "visual/global/Config";
import { assetUrl } from "visual/utils/asset";

export function templateIconUrl(type, iconName) {
  const configUrl = Config.get("urls").templateIcons;

  return configUrl
    ? `${configUrl}/${type}/${iconName}.txt`
    : assetUrl(`editor/icons/${type}/${iconName}.txt`);
}
