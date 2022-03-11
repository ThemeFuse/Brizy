import Config from "visual/global/Config";

export const hasSidebars = (): boolean => Config.get("wp").hasSidebars;

export const pluginActivated = (plugin: string): boolean =>
  Boolean(Config.get("wp").plugins[plugin]);
