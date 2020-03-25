import Config from "visual/global/Config";
import { translate } from "./translate";

const WP = Config.get("wp") || {};
const dictionary = WP.l10n || {};

export const t = (key: string): string => translate(dictionary, key);
