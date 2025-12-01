import { t } from "visual/utils/i18n";
import { Align, Expand, Locked } from "./types";

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

export const expandIcon = (expand: Expand): string => expand ? "t2-contract" : "t2-expand";

export const expandTitle = (expand: Expand): string => expand ? t("Contract Sidebar") : t("Expand Sidebar");
