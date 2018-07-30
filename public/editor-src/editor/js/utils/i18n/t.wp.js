import Config from "visual/global/Config";

const translations = Config.get("wp").l10n;

export const t = key => translations[key];
