import Config from "visual/global/Config";
import { isWp } from "visual/global/Config/types/configs/WP";

export const hasSidebars = (): boolean => Config.get("wp").hasSidebars;

export const pluginActivated = (plugin: string): boolean =>
  Boolean(Config.get("wp").plugins[plugin]);

export const isAdmin = (): boolean => {
  const config = Config.getAll();
  return isWp(config) ? config.user.isWpAdmin : false;
};
