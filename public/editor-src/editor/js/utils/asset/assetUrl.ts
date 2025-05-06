import { ConfigCommon } from "visual/global/Config/types/configs/ConfigCommon";

export function assetUrl(url: string, config: ConfigCommon): string {
  // @ts-expect-error: Need to move urls from WP | Cloud to ConfigCommon
  const { assets } = config.urls;
  return `${assets}/${url}`;
}

// Used for compiler when try to make the urls for every asset
export function compileAssetUrl(url: string, config: ConfigCommon): string {
  const { assets, compileAssets } = config.urls ?? {};
  const baseUrl = compileAssets ?? assets;
  return `${baseUrl}/${url}`;
}
