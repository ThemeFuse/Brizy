import Config from "visual/global/Config";
import * as Str from "visual/utils/reader/string";

export const getCurrentPageId = (): string => {
  if (TARGET === "WP") {
    return Str.read(Config.get("wp").page) ?? "";
  }

  return Str.read(Config.get("page")?.id) ?? "";
};
