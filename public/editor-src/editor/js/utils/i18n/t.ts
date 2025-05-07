import { I18n } from "./I18n";

export type Translation = (key: string) => string;

/**
 * @deprecated use useTranslation hook instead from i18n provider
 */
export const t: Translation = (key) => {
  return I18n.t(key);
};
