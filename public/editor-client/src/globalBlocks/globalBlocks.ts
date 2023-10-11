import { GlobalBlock } from "../types/GlobalBlocks";
import { t } from "../utils/i18n";
import { getGlobalBlocks, getGlobalBlocksByRules } from "../api";

export const globalBlocks: GlobalBlock = {
  async get(res, rej) {
    try {
      const globalBlocks = await getGlobalBlocks();
      res(globalBlocks);
    } catch (e) {
      rej(t("Fail to get global blocks"));
    }
  },
  async getByRules(res, rej, rules) {
    try {
      const globalBlock = await getGlobalBlocksByRules(rules);
      res(globalBlock);
    } catch (e) {
      rej(t("Fail to get global block by rule"));
    }
  }
  // async create(res, rej, extra) {},
  // async update(res, rej, extra) {},
  // async delete(res, rej, extra) {}
};
