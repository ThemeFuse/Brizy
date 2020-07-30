import { t } from "visual/utils/i18n";

// Override Button's sidebar title
export const title = t("Login Submit");

export function getItems() {
  // Button disables it's own sidebar options when it's type === "submit"
  // that's why we do not override nothing here
  return [];
}
