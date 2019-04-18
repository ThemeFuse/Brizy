import Config from "visual/global/Config";

const WP = Config.get("wp") || {};
const translations = WP.l10n || {};

export const t = key => translations[key] || key;
