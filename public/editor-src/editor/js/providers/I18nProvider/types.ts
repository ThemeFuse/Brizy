import type { ReactNode } from "react";
import type { Dictionary } from "visual/utils/i18n/I18n";

export interface Props {
  i18n?: Dictionary;
  children: ReactNode;
}
