import { apiRuleToEditorRule } from "@/popupConditions/utils";
import { getGroupList, getRules, updatePopupRules } from "../api";
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
    },
    async getRuleList(res, rej) {
      try {
        const rules = await getRules();

        const parseRules = rules.map(apiRuleToEditorRule);

        res(parseRules);
      } catch (e) {
        rej(t("Fail to get rule list"));
      }
    },
    async getGroupList(res, rej, type) {
      try {
        const groupList = await getGroupList(type);

        res(groupList);
      } catch (e) {
        rej(t("Fail to get group list"));
      }
    }
  }
};
