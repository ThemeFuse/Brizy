import { Page } from "visual/types";
import { t } from "visual/utils/i18n";

export const getTooltipPageTitle = (status: Page["status"]): string => {
  switch (status) {
    case "publish": {
      return t("Switch to Draft");
    }
    case "draft": {
      return t("Publish Page");
    }
  }
};

export const getTooltipPageIcon = (status: Page["status"]): string => {
  switch (status) {
    case "publish": {
      return "nc-switch";
    }
    case "draft": {
      return "nc-publish";
    }
  }
};
