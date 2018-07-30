import Config from "visual/global/Config";

export function assetUrl(url) {
  return Config.get("urls").assets + "/" + url;
}
