import { Align, Locked } from "./types";
import { t } from "visual/utils/i18n";

export const alignIcon = (align: Align): string => {
  switch (align) {
    case "right":
      return "nc-hrz-align-right";
    case "left":
      return "nc-hrz-align-left";
  }
};

export const alignTitle = (align: Align): string => {
  switch (align) {
    case "right":
      return t("Aligned Right");
    case "left":
      return t("Aligned Left");
  }
};

export const lockedIcon = (l: Locked): string => {
  switch (l) {
    case true:
      return "nc-lock";
    case false:
      return "nc-unlock";
  }
};

export const lockedTitle = (l: Locked): string => {
  switch (l) {
    case true:
      return t("Locked");
    case false:
      return t("Unlocked");
  }
};
