import { createContext } from "react";
import type { Dictionary } from "visual/utils/i18n/I18n";
import type { MValue } from "visual/utils/value";

export interface I18nProvider {
  I18n: Dictionary;
}

export const I18nContext = createContext<MValue<I18nProvider>>(undefined);
