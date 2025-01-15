import Config from "visual/global/Config";
import { ConfigCommon } from "visual/global/Config/types/configs/ConfigCommon";

export function assetUrl(url: string, _config?: ConfigCommon): string {
  const config = _config ?? Config.getAll();
  // @ts-expect-error: Need to move urls from WP | Cloud to ConfigCommon
  const { assets } = config.urls;
  return `${assets}/${url}`;
}

// Used for compiler when try to make the urls for every asset
export function compileAssetUrl(url: string): string {
  const config = Config.getAll();
  const { assets, compileAssets } = config.urls;
  const baseUrl = compileAssets ?? assets;
  return `${baseUrl}/${url}`;
}
