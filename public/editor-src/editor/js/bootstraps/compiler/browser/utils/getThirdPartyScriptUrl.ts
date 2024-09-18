import { ConfigCommon } from "visual/global/Config/types/configs/ConfigCommon";

export function getThirdPartyScriptUrl(config: ConfigCommon): string[] {
  const urls = config.thirdPartyUrls;
  if (!urls) {
    return [];
  }

  return urls.map(({ scriptUrl }) => scriptUrl);
}
