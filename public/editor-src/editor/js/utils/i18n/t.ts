import { I18n } from "./I18n";

export type Translation = (key: string) => string;

export const t: Translation = (key) => {
  return I18n.t(key);
};
