import Config from "visual/global/Config";
import { assetUrl } from "visual/utils/asset";

export function editorIconUrl(icon) {
  const configUrl = Config.get("urls").editorIcons;

  return configUrl
    ? `${configUrl}/icons.svg#${icon}`
    : assetUrl(`editor/icons/icons.svg#${icon}`);
}
