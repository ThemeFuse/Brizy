import Config from "visual/global/Config";
import { assetUrl } from "visual/utils/asset";

export function templateIconUrl(type: string, iconName: string): string {
  const urls = Config.getAll().urls;

  return "templateIcons" in urls
    ? `${urls.templateIcons}/${type}/${iconName}.txt`
    : assetUrl(`editor/icons/${type}/${iconName}.txt`);
}
