import { ConfigCommon } from "visual/global/Config/types/configs/ConfigCommon";
import { MValue } from "visual/utils/value";

export function getThirdPartyScriptUrl(config: ConfigCommon): MValue<string> {
  return config.thirdPartyAssetsURL;
}
