import { createContext } from "react";
import { Dictionary } from "visual/utils/i18n/I18n";
import { MValue } from "visual/utils/value";

interface I18nProvider {
  I18n: Dictionary;
}

export const I18nContext = createContext<MValue<I18nProvider>>(undefined);
