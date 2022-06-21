import { t } from "visual/utils/i18n";
import { Align } from "./types";

export const isDisabled = (
  i: "prev" | "next",
  v: "prev" | "next" | "all" | "none"
): boolean => v === "all" || v === i;

export const firstText = (align: Align): string => {
  switch (align) {
    case "horizontal": {
      return t("Move left");
    }
    case "vertical": {
      return t("Move up");
    }
  }
};
export const secondText = (align: Align): string => {
  switch (align) {
    case "horizontal": {
      return t("Move right");
    }
    case "vertical": {
      return t("Move down");
    }
  }
};
export const firstArrow = (align: Align): string => {
  switch (align) {
    case "horizontal": {
      return "nc-left-arrow-heavy";
    }
    case "vertical": {
      return "nc-arrow-up";
    }
  }
};
export const secondArrow = (align: Align): string => {
  switch (align) {
    case "horizontal": {
      return "nc-right-arrow-heavy";
    }
    case "vertical": {
      return "nc-down-arrow-heavy";
    }
  }
};
