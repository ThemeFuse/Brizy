import { t } from "visual/utils/i18n/index";
import { Weight } from "./Weight";

export const weightTitle = (w: Weight): string => {
  switch (w) {
    case Weight.THIN:
      return t("Thin");
    case Weight.EXTRA_LIGHT:
      return t("Extra Light");
    case Weight.LIGHT:
      return t("Light");
    case Weight.NORMAL:
      return t("Normal");
    case Weight.MEDIUM:
      return t("Medium");
    case Weight.SEMI_BOLD:
      return t("Semi Bold");
    case Weight.BOLD:
      return t("Bold");
    case Weight.EXTRA_BOLD:
      return t("Extra Bold");
    case Weight.BLACK:
      return t("Black");
  }
};
