import { updatePopupRules } from "../api";
import { PopupConditions } from "../types/PopupConditions";
import { t } from "../utils/i18n";

export const popupConditions: PopupConditions = {
  conditions: {
    async save(res, rej, data) {
      try {
        const rules = await updatePopupRules(data);
        res(rules);
      } catch (e) {
        rej(t("Fail to update popup rules"));
      }
    }
  }
};
