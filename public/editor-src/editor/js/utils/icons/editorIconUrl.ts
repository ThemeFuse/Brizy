import { ConfigCommon } from "visual/global/Config/types/configs/ConfigCommon";
import { assetUrl } from "visual/utils/asset";

interface Data {
  icon: string;
  url?: string;
}

export function editorIconUrl(data: Data, config: ConfigCommon) {
  const { icon, url } = data;

  return url
    ? `${url}/icons.svg#${icon}`
    : assetUrl(`editor/icons/icons.svg#${icon}`, config);
}
