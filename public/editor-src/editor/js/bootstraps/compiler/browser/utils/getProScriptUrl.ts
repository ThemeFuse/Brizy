import type { ConfigCommon } from "visual/global/Config/types/configs/ConfigCommon";
import { assetProUrl } from "visual/utils/asset/assetProUrl";
import type { MValue } from "visual/utils/value";

export function getProScriptUrl(config: ConfigCommon): MValue<string> {
  const pro = config.pro;
  return pro
    ? assetProUrl(pro, `js/export.browser.pro.js?v=${pro.version}`)
    : undefined;
}
