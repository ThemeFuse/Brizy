import Config from "visual/global/Config";

export function assetUrl(url: string): string {
  const config = Config.getAll();
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
