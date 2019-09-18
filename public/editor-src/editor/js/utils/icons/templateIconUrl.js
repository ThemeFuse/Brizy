import Config from "visual/global/Config";
import { assetUrl } from "visual/utils/asset";

export function templateIconUrl(type, iconName, suffix = "nc_icon") {
  const configUrl = Config.get("urls").templateIcons;

  return configUrl
    ? `${configUrl}/${type}/${iconName}.svg#${suffix}`
    : assetUrl(`editor/icons/${type}/${iconName}.svg#${suffix}`);
}
