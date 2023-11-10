import Config from "visual/global/Config";
import { translate } from "./translate";

export const t = (key: string): string => {
  const config = Config.getAll();
  const dictionary = config?.l10n ?? {};

  return translate(dictionary, key);
};
