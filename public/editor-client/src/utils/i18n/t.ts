import { getConfig } from "../../config";
import { translate } from "./translate";

export const t = (key: string): string => {
  const config = getConfig();
  const dictionary = config?.l10n ?? {};

  return translate(dictionary, key);
};
