import Config from "visual/global/Config";
import * as Str from "visual/utils/reader/string";

/**
 * Return page id used only with new CMS API
 *
 * @internal
 * @return {string} The page id in wp or cloud
 */
export const getCurrentPageId = (): string => {
  if (TARGET === "WP") {
    return Str.read(Config.get("wp").page) ?? "";
  }

  return Str.read(Config.get("page")?.id) ?? "";
};
