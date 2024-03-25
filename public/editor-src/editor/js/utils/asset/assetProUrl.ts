import { Pro } from "visual/global/Config/types/Pro";

export function assetProUrl(config: Pro, url: string): string {
  return `${config.urls.assets}/${url}`;
}

// Used for compiler when try to make the urls for every asset
export function compileAssetProUrl(config: Pro, url: string): string {
  const { assets, compileAssets } = config.urls;
  const baseUrl = compileAssets ?? assets;
  return `${baseUrl}/${url}`;
}
