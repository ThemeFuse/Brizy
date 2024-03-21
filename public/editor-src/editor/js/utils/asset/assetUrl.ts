import Config from "visual/global/Config";

export function assetUrl(url: string): string {
  const config = Config.getAll();
  const { assets } = config.urls;
  return `${assets}/${url}`;
}
