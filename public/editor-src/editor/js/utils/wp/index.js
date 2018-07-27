import Config from "visual/global/Config";

export const hasSidebars = () => Config.get("wp").hasSidebars;

export const pluginActivated = plugin =>
  Boolean(Config.get("wp").plugins[plugin]);
