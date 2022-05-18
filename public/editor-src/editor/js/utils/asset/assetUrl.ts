import Config from "visual/global/Config";

export function assetUrl(url: string): string {
  return Config.getAll().urls.assets + "/" + url;
}
