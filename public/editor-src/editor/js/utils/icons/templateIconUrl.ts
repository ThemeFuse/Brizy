import Config from "visual/global/Config";
import { assetUrl } from "visual/utils/asset";

export function templateIconUrl(
  type: string,
  iconName: string,
  suffix: string | undefined = "nc_icon"
): string {
  const urls = Config.getAll().urls;
  const url =
    "templateIcons" in urls
      ? `${urls.templateIcons}/${type}/${iconName}.svg`
      : assetUrl(`editor/icons/${type}/${iconName}.svg`);

  return suffix === undefined ? url : `${url}#${suffix}`;
}
