import { isWp } from "visual/global/Config";
import { ConfigCommon } from "visual/global/Config/types/configs/ConfigCommon";

export const hasSidebars = (config: ConfigCommon): boolean => {
  if (isWp(config)) {
    return config.wp.hasSidebars;
  }
  return false;
};

export const pluginActivated = (
  config: ConfigCommon,
  plugin: string
): boolean => {
  if (isWp(config)) {
    const plugins = config.wp.plugins;
    return Boolean(plugins[plugin]);
  }

  return false;
};
