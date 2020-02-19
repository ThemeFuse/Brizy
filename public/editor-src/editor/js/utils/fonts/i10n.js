import { t } from "visual/utils/i18n/index";
import {
  BLACK,
  BOLD,
  EXTRA_BOLD,
  EXTRA_LIGHT,
  LIGHT,
  MEDIUM,
  NORMAL,
  SEMI_BOLD,
  THIN
} from "visual/utils/fonts/weight";

export const weightTitle = w => {
  switch (w) {
    case THIN:
      return t("Thin");
    case EXTRA_LIGHT:
      return t("Extra Light");
    case LIGHT:
      return t("Light");
    case NORMAL:
      return t("Normal");
    case MEDIUM:
      return t("Medium");
    case SEMI_BOLD:
      return t("Semi Bold");
    case BOLD:
      return t("Bold");
    case EXTRA_BOLD:
      return t("Extra Bold");
    case BLACK:
      return t("Black");
    default:
      String(w);
  }
};
